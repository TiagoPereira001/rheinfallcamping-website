import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";

function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, loading } = useVehicles();
  const [photoIndex, setPhotoIndex] = useState(0);
  const vehicle = vehicles.find((v) => String(v.id) === id);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f4f4f2]">
        <p className="text-black/50 text-sm">A carregar...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f4f4f2]">
        <button onClick={() => navigate("/stock")} className="text-black underline">
          Voltar ao Stock
        </button>
      </div>
    );
  }

  const brevemente = vehicle.status === "brevemente";

  // Junta a galeria: usa "images" se existir, senão cai para o campo antigo "image"
  const gallery = vehicle.images?.length ? vehicle.images : vehicle.image ? [vehicle.image] : [];
  const hasMultiple = gallery.length > 1;
  const currentPhoto = gallery[photoIndex] ?? gallery[0];

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % gallery.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + gallery.length) % gallery.length);

  const specs = [
    { label: "Ano", value: vehicle.year },
    { label: "Quilómetros", value: vehicle.km },
    { label: "Transmissão", value: vehicle.transmission },
    { label: "Combustível", value: vehicle.fuel },
    { label: "Lotação", value: vehicle.seats },
    { label: "Garantia", value: vehicle.warranty },
  ].filter((s) => s.value);

  return (
    <div className="bg-[#f4f4f2] min-h-screen">
      <div className="w-full h-[40vh] md:h-[60vh] bg-[#1c1c1c] relative">
        {currentPhoto && (
          <img
            src={currentPhoto}
            alt={`${vehicle.name} — foto ${photoIndex + 1}`}
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <button
          onClick={() => navigate("/stock")}
          className="absolute top-6 left-6 lg:left-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 flex items-center gap-2 rounded-full text-sm font-medium transition-colors"
        >
          <ChevronLeft size={16} /> Voltar
        </button>

        {hasMultiple && (
          <>
            <button
              onClick={prevPhoto}
              aria-label="Foto anterior"
              className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextPhoto}
              aria-label="Foto seguinte"
              className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <span className="absolute bottom-6 right-6 lg:right-10 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
              {photoIndex + 1} / {gallery.length}
            </span>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === photoIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        {hasMultiple && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-12 -mt-4">
            {gallery.map((photo, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === photoIndex ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            {brevemente && (
              <span className="inline-block bg-[#C2A07A] text-white text-[0.6875rem] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                Brevemente em stock
              </span>
            )}
            <h1 className="font-serif text-black text-4xl md:text-5xl font-medium mb-4">
              {vehicle.name}
            </h1>
            {vehicle.price && (
              <p className="text-black text-3xl font-medium mb-12">
                {vehicle.price}
              </p>
            )}

            {vehicle.description && (
              <div className="prose prose-sm md:prose-base text-black/80 mb-12">
                <p>{vehicle.description}</p>
              </div>
            )}

            {specs.length > 0 && (
              <>
                <h3 className="font-serif text-2xl font-medium mb-6">Especificações</h3>
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-y divide-black/5">
                    {specs.map((spec) => (
                      <div key={spec.label} className="p-4 md:p-6">
                        <span className="block text-xs uppercase tracking-wider text-black/40 mb-1">
                          {spec.label}
                        </span>
                        <span className="font-medium text-black">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#C2A07A] rounded-3xl p-8 sticky top-24 shadow-lg text-white">
              <h3 className="font-serif text-2xl font-medium mb-2">Tem interesse?</h3>
              <p className="text-white/80 text-sm mb-8">
                {brevemente
                  ? "Esta autocaravana ainda não chegou ao nosso stand. Deixe o seu contacto e avisamos assim que estiver disponível."
                  : "Deixe o seu contacto para agendarmos uma visita ou para fazer uma proposta."}
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email ou Telefone"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all"
                />
                <button className="w-full bg-white text-black text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/90 transition-colors mt-2 shadow-sm">
                  {brevemente ? "Avisar-me quando chegar" : "Agendar Visita"}
                </button>
                {!brevemente && (
                  <button className="w-full bg-transparent border border-white/30 text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                    Fazer Proposta
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPage;