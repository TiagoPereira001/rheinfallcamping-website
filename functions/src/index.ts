import { createHash, createHmac, randomUUID } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineJsonSecret, defineSecret } from "firebase-functions/params";
import { HttpsError, onCall, type CallableRequest } from "firebase-functions/v2/https";
import {
  validarAlteracaoLead,
  validarAtualizacaoVeiculo,
  validarId,
  validarLead,
  validarUpload,
  validarVeiculo,
} from "./validation";

initializeApp();

const db = getFirestore();
const REGION = "europe-west1";
const ORIGENS_PERMITIDAS = [
  "https://rheinfallcamping.pt",
  "https://www.rheinfallcamping.pt",
  /^http:\/\/localhost:\d+$/,
];
const opcoesPublicas = {
  region: REGION,
  cors: ORIGENS_PERMITIDAS,
  enforceAppCheck: true,
  consumeAppCheckToken: true,
} as const;

const segredoRateLimit = defineSecret("RATE_LIMIT_SALT");
const cloudinary = defineJsonSecret("CLOUDINARY_CONFIG");

type CloudinaryConfig = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  uploadPreset: string;
};

async function exigirAdmin(requisicao: CallableRequest<unknown>) {
  const autenticacao = requisicao.auth;
  if (
    !autenticacao ||
    autenticacao.token.admin !== true ||
    autenticacao.token.email_verified !== true
  ) {
    throw new HttpsError("permission-denied", "Acesso reservado ao administrador.");
  }

  // As claims no token duram até uma hora. Confirmar o utilizador no Auth torna
  // uma revogação efetiva de imediato, sem depender desse token antigo expirar.
  const utilizador = await getAuth().getUser(autenticacao.uid);
  if (
    utilizador.disabled ||
    !utilizador.emailVerified ||
    utilizador.customClaims?.admin !== true
  ) {
    throw new HttpsError("permission-denied", "Acesso reservado ao administrador.");
  }
}

function obterIp(requisicao: CallableRequest<unknown>) {
  const encaminhado = requisicao.rawRequest.headers["x-forwarded-for"];
  const primeiro = Array.isArray(encaminhado) ? encaminhado[0] : encaminhado;
  return primeiro?.split(",")[0]?.trim() || "desconhecido";
}

async function limitarPedidos(requisicao: CallableRequest<unknown>) {
  const ip = obterIp(requisicao);
  const chave = createHmac("sha256", segredoRateLimit.value()).update(ip).digest("hex");
  const referencia = db.collection("securityRateLimits").doc(`lead-${chave}`);
  const agora = Date.now();
  const janelaMs = 60 * 60 * 1000;
  const maximoPorJanela = 3;

  await db.runTransaction(async (transacao) => {
    const atual = await transacao.get(referencia);
    const dados = atual.data();
    const inicio = typeof dados?.inicio === "number" ? dados.inicio : 0;
    const aindaNaJanela = agora - inicio < janelaMs;
    const contagem = aindaNaJanela && typeof dados?.contagem === "number" ? dados.contagem : 0;

    if (contagem >= maximoPorJanela) {
      throw new HttpsError(
        "resource-exhausted",
        "Demasiados pedidos. Tente novamente mais tarde.",
      );
    }

    transacao.set(referencia, {
      inicio: aindaNaJanela ? inicio : agora,
      contagem: contagem + 1,
      expiraEm: Timestamp.fromMillis(agora + janelaMs),
    });
  });
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : "";
}

function dataIso(valor: unknown): string | null {
  return valor instanceof Timestamp ? valor.toDate().toISOString() : null;
}

function configuracaoCloudinary(): CloudinaryConfig {
  const config = cloudinary.value() as Partial<CloudinaryConfig>;
  if (
    !config ||
    typeof config.apiKey !== "string" ||
    typeof config.apiSecret !== "string" ||
    typeof config.cloudName !== "string" ||
    typeof config.uploadPreset !== "string"
  ) {
    logger.error("CLOUDINARY_CONFIG está incompleta.");
    throw new HttpsError("failed-precondition", "O serviço de imagens não está configurado.");
  }

  return config as CloudinaryConfig;
}

function assinarCloudinary(parametros: Record<string, string | number>, apiSecret: string) {
  const textoAssinado = Object.entries(parametros)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, valor]) => `${chave}=${valor}`)
    .join("&");

  return createHash("sha256").update(`${textoAssinado}${apiSecret}`).digest("hex");
}

export const submitLead = onCall(
  { ...opcoesPublicas, secrets: [segredoRateLimit] },
  async (requisicao) => {
    const lead = validarLead(requisicao.data);
    await limitarPedidos(requisicao);

    const documento = await db.collection("leads").add({
      ...lead,
      criadoEm: FieldValue.serverTimestamp(),
      tratado: false,
    });

    return { id: documento.id };
  },
);

export const listLeads = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);

  const resultado = await db.collection("leads").orderBy("criadoEm", "desc").get();
  return resultado.docs.map((documento) => {
    const lead = documento.data();
    return {
      id: documento.id,
      nome: texto(lead.nome),
      contacto: texto(lead.contacto),
      marca: texto(lead.marca),
      ano: texto(lead.ano),
      km: texto(lead.km),
      preco: texto(lead.preco),
      notas: texto(lead.notas),
      tratado: lead.tratado === true,
      criadoEm: dataIso(lead.criadoEm),
    };
  });
});

export const setLeadTratado = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);
  const { id, tratado } = validarAlteracaoLead(requisicao.data);

  await db.collection("leads").doc(id).update({ tratado });
  return { ok: true as const };
});

export const deleteLead = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);
  const id = validarId(requisicao.data);

  await db.collection("leads").doc(id).delete();
  return { ok: true as const };
});

export const createVehicle = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);
  const veiculo = validarVeiculo(requisicao.data);

  const documento = await db.collection("vehicles").add(veiculo);
  return { id: documento.id };
});

export const updateVehicle = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);
  const { id, dados } = validarAtualizacaoVeiculo(requisicao.data);
  const referencia = db.collection("vehicles").doc(id);

  await db.runTransaction(async (transacao) => {
    const atual = await transacao.get(referencia);
    if (!atual.exists) {
      throw new HttpsError("not-found", "A autocaravana já não existe.");
    }
    transacao.set(referencia, dados);
  });

  return { ok: true as const };
});

export const deleteVehicle = onCall(opcoesPublicas, async (requisicao) => {
  await exigirAdmin(requisicao);
  const id = validarId(requisicao.data);

  await db.collection("vehicles").doc(id).delete();
  return { ok: true as const };
});

export const createVehicleUpload = onCall(
  { ...opcoesPublicas, secrets: [cloudinary] },
  async (requisicao) => {
    await exigirAdmin(requisicao);
    validarUpload(requisicao.data);

    const config = configuracaoCloudinary();
    const timestamp = Math.floor(Date.now() / 1_000);
    const parametros = {
      folder: "vehicles",
      public_id: randomUUID(),
      tags: "rheinfallcamping,vehicle",
      timestamp,
      upload_preset: config.uploadPreset,
      use_filename: "false",
      unique_filename: "false",
    };

    return {
      apiKey: config.apiKey,
      cloudName: config.cloudName,
      folder: parametros.folder,
      publicId: parametros.public_id,
      signature: assinarCloudinary(parametros, config.apiSecret),
      tags: parametros.tags,
      timestamp,
      uploadPreset: parametros.upload_preset,
    };
  },
);
