import { useState } from "react";
import VehicleCard from "../components/VehicleCard";

const emptyForm = { name: "", year: "", km: "", price: "", image: "" };

function AdminPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Ainda não guarda em lado nenhum — falta ligar isto a uma base de dados.
  };

  const previewVehicle = {
    id: "preview",
    name: form.name || "Nome da autocaravana",
    year: form.year || "----",
    km: form.km ? `${form.km} km` : "-- km",
    price: form.price ? `€ ${form.price}` : "€ --",
    image:
      form.image ||
      "https://images.unsplash.com/photo-1533591378-8de97ae9ac1c?w=700&h=440&fit=crop&auto=format",
  };

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <h1 className="font-serif text-black text-3xl md:text-4xl font-medium mb-2">
          Adicionar autocaravana
        </h1>
        <p className="text-black/60 text-sm mb-12">
          Área interna — ainda não grava no site, só mostra a pré-visualização do card.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm space-y-5"
          >
            <div>
              <label className="block text-black text-sm font-medium mb-2">Nome</label>
              <input
                value={form.name}
                onChange={handleChange("name")}
                type="text"
                placeholder="Ex: Fiat Dethleffs Trend"
                className="w-full bg-[#f4f4f2] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black text-sm font-medium mb-2">Ano</label>
                <input
                  value={form.year}
                  onChange={handleChange("year")}
                  type="text"
                  placeholder="2021"
                  className="w-full bg-[#f4f4f2] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-black text-sm font-medium mb-2">Quilómetros</label>
                <input
                  value={form.km}
                  onChange={handleChange("km")}
                  type="text"
                  placeholder="28.400"
                  className="w-full bg-[#f4f4f2] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">Preço (€)</label>
              <input
                value={form.price}
                onChange={handleChange("price")}
                type="text"
                placeholder="67.900"
                className="w-full bg-[#f4f4f2] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">URL da foto</label>
              <input
                value={form.image}
                onChange={handleChange("image")}
                type="text"
                placeholder="https://..."
                className="w-full bg-[#f4f4f2] border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all"
              />
            </div>

            <button className="w-full bg-black text-white text-sm font-medium py-3 rounded-xl hover:bg-black/80 transition-colors">
              Guardar
            </button>

            {submitted && (
              <p className="text-xs text-black/50 text-center">
                Pré-visualização atualizada — a gravação a sério ainda não está ligada.
              </p>
            )}
          </form>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-4">
              Pré-visualização do card
            </p>
            <div className="max-w-sm">
              <VehicleCard v={previewVehicle} onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;