import { useParams, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { vehicles } from "../data/vehicles";

function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = vehicles.find((v) => String(v.id) === id);

  if (!vehicle) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f4f4f2]">
        <button onClick={() => navigate("/stock")} className="text-black underline">
          Voltar ao Stock
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f2] min-h-screen">
      <div className="w-full h-[40vh] md:h-[60vh] bg-[#1c1c1c] relative">
        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button onClick={() => navigate("/stock")} className="absolute top-6 left-6 lg:left-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 flex items-center gap-2 rounded-full text-sm font-medium transition-colors">
          <ChevronLeft size={16} /> Voltar
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <h1 className="font-serif text-black text-4xl md:text-5xl font-medium mb-4">{vehicle.name}</h1>
            <p className="text-black text-3xl font-medium mb-12">{vehicle.price}</p>
            <div className="prose prose-sm md:prose-base text-black/80 mb-12">
              <p>
                Esta fantástica autocaravana {vehicle.name} oferece o máximo conforto
                e segurança para as suas viagens. Cuidadosamente inspecionada, apresenta
                um interior espaçoso e acabamentos de alta qualidade.
              </p>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-6">Especificações</h3>
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-y divide-black/5">
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Ano</span><span className="font-medium text-black">{vehicle.year}</span></div>
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Quilómetros</span><span className="font-medium text-black">{vehicle.km}</span></div>
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Transmissão</span><span className="font-medium text-black">Manual</span></div>
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Combustível</span><span className="font-medium text-black">Diesel</span></div>
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Lotação</span><span className="font-medium text-black">4 pessoas</span></div>
                <div className="p-4 md:p-6"><span className="block text-xs uppercase tracking-wider text-black/40 mb-1">Garantia</span><span className="font-medium text-black">18 Meses</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#C2A07A] rounded-3xl p-8 sticky top-24 shadow-lg text-white">
              <h3 className="font-serif text-2xl font-medium mb-2">Tem interesse?</h3>
              <p className="text-white/80 text-sm mb-8">Deixe o seu contacto para agendarmos uma visita ou para fazer uma proposta.</p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nome" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all" />
                <input type="email" placeholder="Email ou Telefone" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all" />
                <button className="w-full bg-white text-black text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/90 transition-colors mt-2 shadow-sm">Agendar Visita</button>
                <button className="w-full bg-transparent border border-white/30 text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/5 transition-colors">Fazer Proposta</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPage;