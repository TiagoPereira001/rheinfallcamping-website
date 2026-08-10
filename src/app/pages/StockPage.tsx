import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import VehicleCard from "../components/VehicleCard";

function StockPage() {
  const navigate = useNavigate();
  const { vehicles, loading, error } = useVehicles();

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <h1 className="font-serif text-black text-4xl md:text-5xl font-medium mb-4">
            O nosso Stock
          </h1>
          <p className="text-black/60 text-sm max-w-xl">
            Explore a nossa coleção de autocaravanas inspecionadas e prontas para a sua próxima viagem.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm sticky top-24">
              <h3 className="font-serif text-lg font-medium mb-6">Filtros</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                    Preço
                  </label>
                  <select className="w-full bg-[#f4f4f2] text-sm rounded-lg p-2.5 outline-none focus:ring-1 ring-black/20">
                    <option>Qualquer preço</option>
                    <option>Até € 50.000</option>
                    <option>€ 50.000 - € 80.000</option>
                    <option>Mais de € 80.000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                    Ano
                  </label>
                  <select className="w-full bg-[#f4f4f2] text-sm rounded-lg p-2.5 outline-none focus:ring-1 ring-black/20">
                    <option>Qualquer ano</option>
                    <option>2023 - 2024</option>
                    <option>2020 - 2022</option>
                    <option>Antes de 2020</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                    Marca
                  </label>
                  <div className="space-y-2">
                    {["Fiat", "Hymer", "Adria", "Sunlight", "Pilote", "Carthago"].map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded-sm text-black accent-black focus:ring-black" />
                        <span className="text-sm text-black/80">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white text-sm font-medium py-3 rounded-xl mt-8 hover:bg-black/80 transition-colors">
                Aplicar Filtros
              </button>
            </div>
          </aside>

          <div className="flex-1">
            {loading && <p className="text-black/50 text-sm">A carregar stock...</p>}
            {error && <p className="text-red-700 text-sm">{error}</p>}
            {!loading && !error && vehicles.length === 0 && (
              <p className="text-black/50 text-sm">
                Ainda não há autocaravanas em stock.
              </p>
            )}
            {!loading && !error && vehicles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} v={v} onClick={() => navigate(`/stock/${v.id}`)} />
                ))}
              </div>
            )}

            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="p-2 border border-black/10 rounded-lg hover:bg-black/5 text-black/40 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-black text-white text-sm font-medium">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 text-black/70 text-sm font-medium transition-colors">
                2
              </button>
              <button className="p-2 border border-black/10 rounded-lg hover:bg-black/5 text-black/70 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockPage;