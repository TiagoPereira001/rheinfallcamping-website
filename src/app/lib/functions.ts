import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app, "europe-west1");

export type VehiclePayload = {
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

export type LeadPayload = {
  nome: string;
  contacto: string;
  marca: string;
  ano?: string;
  km?: string;
  preco?: string;
  notas?: string;
  website?: string;
};

export type LeadResponse = {
  id: string;
  nome: string;
  contacto: string;
  marca: string;
  ano: string;
  km: string;
  preco: string;
  notas: string;
  tratado: boolean;
  criadoEm: string | null;
};

type UploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  signature: string;
  tags: string;
  timestamp: number;
  uploadPreset: string;
};

async function chamar<TRequest, TResponse>(nome: string, dados: TRequest) {
  const callable = httpsCallable<TRequest, TResponse>(functions, nome);
  const resposta = await callable(dados);
  return resposta.data;
}

export const api = {
  submitLead: (dados: LeadPayload) => chamar<LeadPayload, { id: string }>("submitLead", dados),
  listLeads: () => chamar<Record<string, never>, LeadResponse[]>("listLeads", {}),
  setLeadTratado: (id: string, tratado: boolean) =>
    chamar<{ id: string; tratado: boolean }, { ok: true }>("setLeadTratado", { id, tratado }),
  deleteLead: (id: string) => chamar<{ id: string }, { ok: true }>("deleteLead", { id }),
  createVehicle: (dados: VehiclePayload) =>
    chamar<VehiclePayload, { id: string }>("createVehicle", dados),
  updateVehicle: (id: string, dados: VehiclePayload) =>
    chamar<{ id: string; dados: VehiclePayload }, { ok: true }>("updateVehicle", { id, dados }),
  deleteVehicle: (id: string) =>
    chamar<{ id: string }, { ok: true }>("deleteVehicle", { id }),
  createVehicleUpload: (file: { name: string; type: string; size: number }) =>
    chamar<{ name: string; type: string; size: number }, UploadSignature>(
      "createVehicleUpload",
      file,
    ),
};
