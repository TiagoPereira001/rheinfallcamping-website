import { HttpsError } from "firebase-functions/v2/https";

export type VehicleInput = {
  name: string;
  year?: string;
  km?: string;
  price?: string;
  images?: string[];
  status?: "brevemente" | "vendida";
  description?: string;
  registration?: string;
  engine?: string;
  power?: string;
  fuel?: string;
  transmission?: string;
  seats?: string;
  beds?: string;
  condition?: string;
  warranty?: string;
  features?: string[];
};

export type LeadInput = {
  nome: string;
  contacto: string;
  marca: string;
  ano: string;
  km: string;
  preco: string;
  notas: string;
};

type UnknownRecord = Record<string, unknown>;

function erro(campo: string): never {
  throw new HttpsError("invalid-argument", `O campo ${campo} não é válido.`);
}

function objeto(dados: unknown): UnknownRecord {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new HttpsError("invalid-argument", "O pedido não é válido.");
  }

  return dados as UnknownRecord;
}

function apenasCampos(dados: UnknownRecord, campos: readonly string[]) {
  if (Object.keys(dados).some((campo) => !campos.includes(campo))) {
    throw new HttpsError("invalid-argument", "O pedido contém campos não permitidos.");
  }
}

function texto(
  dados: UnknownRecord,
  campo: string,
  limite: number,
  obrigatorio = false,
): string | undefined {
  const valor = dados[campo];

  if (valor === undefined) {
    if (obrigatorio) erro(campo);
    return undefined;
  }

  if (typeof valor !== "string") erro(campo);

  const limpo = valor.trim();
  if ((obrigatorio && !limpo) || limpo.length > limite) erro(campo);

  return limpo || undefined;
}

function listaDeTexto(
  dados: UnknownRecord,
  campo: string,
  maximoItens: number,
  limitePorItem: number,
): string[] | undefined {
  const valor = dados[campo];
  if (valor === undefined) return undefined;

  if (!Array.isArray(valor) || valor.length > maximoItens) erro(campo);

  const itens = valor.map((item) => {
    if (typeof item !== "string") erro(campo);
    const limpo = item.trim();
    if (!limpo || limpo.length > limitePorItem) erro(campo);
    return limpo;
  });

  if (new Set(itens).size !== itens.length) erro(campo);
  return itens.length ? itens : undefined;
}

function urlCloudinary(valor: string): boolean {
  try {
    const url = new URL(valor);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      /^\/[^/]+\/image\/upload\/(?:v\d+\/)?vehicles\//.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function validarVeiculo(dadosRecebidos: unknown): VehicleInput {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, [
    "name",
    "year",
    "km",
    "price",
    "images",
    "status",
    "description",
    "registration",
    "engine",
    "power",
    "fuel",
    "transmission",
    "seats",
    "beds",
    "condition",
    "warranty",
    "features",
  ]);

  const images = listaDeTexto(dados, "images", 20, 1_500);
  if (images?.some((imagem) => !urlCloudinary(imagem))) erro("images");

  const status = texto(dados, "status", 12);
  if (status && status !== "brevemente" && status !== "vendida") erro("status");

  return removerIndefinidos({
    name: texto(dados, "name", 160, true)!,
    year: texto(dados, "year", 20),
    km: texto(dados, "km", 30),
    price: texto(dados, "price", 50),
    images,
    status: status as VehicleInput["status"],
    description: texto(dados, "description", 4_000),
    registration: texto(dados, "registration", 30),
    engine: texto(dados, "engine", 80),
    power: texto(dados, "power", 40),
    fuel: texto(dados, "fuel", 40),
    transmission: texto(dados, "transmission", 40),
    seats: texto(dados, "seats", 40),
    beds: texto(dados, "beds", 100),
    condition: texto(dados, "condition", 160),
    warranty: texto(dados, "warranty", 160),
    features: listaDeTexto(dados, "features", 50, 160),
  });
}

export function validarLead(dadosRecebidos: unknown): LeadInput {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, ["nome", "contacto", "marca", "ano", "km", "preco", "notas", "website"]);

  // Campo invisível para utilizadores reais. Não é a barreira de segurança,
  // mas reduz submissões automáticas antes de atingirem a base de dados.
  if (texto(dados, "website", 200)) {
    throw new HttpsError("permission-denied", "Não foi possível enviar o pedido.");
  }

  return {
    nome: texto(dados, "nome", 100, true)!,
    contacto: texto(dados, "contacto", 100, true)!,
    marca: texto(dados, "marca", 150, true)!,
    ano: texto(dados, "ano", 20) ?? "",
    km: texto(dados, "km", 30) ?? "",
    preco: texto(dados, "preco", 50) ?? "",
    notas: texto(dados, "notas", 2_000) ?? "",
  };
}

export function validarId(dadosRecebidos: unknown): string {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, ["id"]);
  const id = texto(dados, "id", 128, true)!;

  if (!/^[A-Za-z0-9_-]+$/.test(id)) erro("id");
  return id;
}

export function validarAlteracaoLead(dadosRecebidos: unknown) {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, ["id", "tratado"]);
  const id = texto(dados, "id", 128, true)!;
  if (!/^[A-Za-z0-9_-]+$/.test(id) || typeof dados.tratado !== "boolean") {
    throw new HttpsError("invalid-argument", "O pedido não é válido.");
  }

  return { id, tratado: dados.tratado };
}

export function validarAtualizacaoVeiculo(dadosRecebidos: unknown) {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, ["id", "dados"]);
  const id = texto(dados, "id", 128, true)!;
  if (!/^[A-Za-z0-9_-]+$/.test(id)) erro("id");

  return { id, dados: validarVeiculo(dados.dados) };
}

export function validarUpload(dadosRecebidos: unknown) {
  const dados = objeto(dadosRecebidos);
  apenasCampos(dados, ["name", "type", "size"]);
  const nome = texto(dados, "name", 255, true)!;
  const tipo = texto(dados, "type", 100, true)!;
  const tamanho = dados.size;

  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(tipo) ||
    typeof tamanho !== "number" ||
    !Number.isSafeInteger(tamanho) ||
    tamanho <= 0 ||
    tamanho > 10 * 1024 * 1024
  ) {
    throw new HttpsError("invalid-argument", "O ficheiro não é válido.");
  }

  return { nome, tipo, tamanho };
}

function removerIndefinidos<T extends Record<string, unknown>>(dados: T): T {
  return Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== undefined),
  ) as T;
}
