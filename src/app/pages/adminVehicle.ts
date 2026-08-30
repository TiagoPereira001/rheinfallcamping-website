import type { VehiclePayload } from "../lib/functions";

export type VehicleForm = {
  name: string;
  year: string;
  km: string;
  price: string;
  status: string;
  registration: string;
  engine: string;
  power: string;
  fuel: string;
  transmission: string;
  seats: string;
  beds: string;
  condition: string;
  warranty: string;
  description: string;
  images: string;
  features: string;
};

function valor(texto: string) {
  const limpo = texto.trim();
  return limpo || undefined;
}

function lista(texto: string) {
  const itens = texto
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return itens.length ? itens : undefined;
}

export function prepararVeiculo(form: VehicleForm): VehiclePayload {
  const status = form.status === "brevemente" || form.status === "vendida"
    ? form.status
    : undefined;

  return {
    name: form.name.trim(),
    ...(valor(form.year) && { year: valor(form.year) }),
    ...(valor(form.km) && { km: valor(form.km) }),
    ...(valor(form.price) && { price: valor(form.price) }),
    ...(lista(form.images) && { images: lista(form.images) }),
    ...(status && { status }),
    ...(valor(form.description) && { description: valor(form.description) }),
    ...(valor(form.registration) && { registration: valor(form.registration) }),
    ...(valor(form.engine) && { engine: valor(form.engine) }),
    ...(valor(form.power) && { power: valor(form.power) }),
    ...(valor(form.fuel) && { fuel: valor(form.fuel) }),
    ...(valor(form.transmission) && { transmission: valor(form.transmission) }),
    ...(valor(form.seats) && { seats: valor(form.seats) }),
    ...(valor(form.beds) && { beds: valor(form.beds) }),
    ...(valor(form.condition) && { condition: valor(form.condition) }),
    ...(valor(form.warranty) && { warranty: valor(form.warranty) }),
    ...(lista(form.features) && { features: lista(form.features) }),
  };
}
