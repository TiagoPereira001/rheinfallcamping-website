import { HttpsError } from "firebase-functions/v2/https";

const CAMPOS_VEICULO_TEXTO = [
  "year", "km", "price", "image", "description",
  "registration", "engine", "power", "fuel", "transmission",
  "seats", "beds", "condition", "warranty",
] as const;

function erro(mensagem: string): never {
  throw new HttpsError("invalid-argument", mensagem);
}

function objeto(data: unknown): Record<string, unknown> {
  if (typeof data !== "object" || data === null) erro("Dados inválidos.");
  return data as Record<string, unknown>;
}

function texto(
  valor: unknown,
  campo: string,
  opcoes: { obrigatorio?: boolean; max?: number } = {}
): string {
  if (valor === undefined || valor === null || valor === "") {
    if (opcoes.obrigatorio) erro(`Campo "${campo}" é obrigatório.`);
    return "";
  }
  if (typeof valor !== "string") erro(`Campo "${campo}" tem de ser texto.`);
  const v = valor.trim();
  if (opcoes.obrigatorio && v.length === 0) erro(`Campo "${campo}" é obrigatório.`);
  if (opcoes.max && v.length > opcoes.max) erro(`Campo "${campo}" é demasiado longo.`);
  return v;
}

function listaDeTexto(valor: unknown, campo: string): string[] {
  if (valor === undefined) return [];
  if (!Array.isArray(valor)) erro(`Campo "${campo}" tem de ser uma lista.`);
  return valor
    .map((item, i) => {
      if (typeof item !== "string") erro(`Item ${i} de "${campo}" tem de ser texto.`);
      return item.trim();
    })
    .filter(Boolean);
}

export type LeadValidado = {
  nome: string;
  contacto: string;
  marca: string;
  ano: string;
  km: string;
  preco: string;
  notas: string;
};

export function validarLead(data: unknown): LeadValidado {
  const d = objeto(data);
  return {
    nome: texto(d.nome, "nome", { obrigatorio: true, max: 99 }),
    contacto: texto(d.contacto, "contacto", { obrigatorio: true, max: 99 }),
    marca: texto(d.marca, "marca", { obrigatorio: true, max: 149 }),
    ano: texto(d.ano, "ano", { max: 19 }),
    km: texto(d.km, "km", { max: 29 }),
    preco: texto(d.preco, "preco", { max: 49 }),
    notas: texto(d.notas, "notas", { max: 1999 }),
  };
}

export function validarAlteracaoLead(data: unknown): { id: string; tratado: boolean } {
  const d = objeto(data);
  if (typeof d.tratado !== "boolean") erro('Campo "tratado" tem de ser verdadeiro/falso.');
  return { id: texto(d.id, "id", { obrigatorio: true, max: 200 }), tratado: d.tratado };
}

export type VeiculoValidado = Record<string, unknown>;

export function validarVeiculo(data: unknown): VeiculoValidado {
  const d = objeto(data);
  const resultado: Record<string, unknown> = {
    name: texto(d.name, "name", { obrigatorio: true, max: 199 }),
  };

  for (const campo of CAMPOS_VEICULO_TEXTO) {
    if (d[campo] === undefined) continue;
    const v = texto(d[campo], campo, { max: 500 });
    if (v) resultado[campo] = v;
  }

  if (d.status !== undefined) {
    const status = texto(d.status, "status", { max: 20 });
    if (status && !["brevemente", "vendida"].includes(status)) {
      erro('Campo "status" inválido.');
    }
    if (status) resultado.status = status;
  }

  const images = listaDeTexto(d.images, "images");
  if (images.length) resultado.images = images;

  const features = listaDeTexto(d.features, "features");
  if (features.length) resultado.features = features;

  return resultado;
}

export function validarAtualizacaoVeiculo(
  data: unknown
): { id: string; dados: VeiculoValidado } {
  const d = objeto(data);
  return {
    id: texto(d.id, "id", { obrigatorio: true, max: 200 }),
    dados: validarVeiculo(d.dados),
  };
}

export function validarId(data: unknown): string {
  const d = objeto(data);
  return texto(d.id, "id", { obrigatorio: true, max: 200 });
}

export function validarUpload(data: unknown): void {
  if (data !== undefined && data !== null && typeof data !== "object") {
    erro("Dados inválidos.");
  }
}
