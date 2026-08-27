import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Check, ImageIcon } from "lucide-react";
import { useVehicle } from "../hooks/useVehicles";
import { whatsappLink } from "../data/config";
import { usePageTitle } from "../hooks/usePageTitle";
import ShareButtons from "../components/ShareButtons";
import { useStructuredData } from "../hooks/useStructuredData";
import { parseNumero } from "../lib/utils";

function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading } = useVehicle(id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [form, setForm] = useState({ nome: "", contacto: "" });
  const [erro, setErro] = useState("");

  usePageTitle(
    vehicle?.name,
    vehicle
      ? `${vehicle.name}${vehicle.year ? ` de ${vehicle.year}` : ""}. Autocaravana usada na zona da Covilhã.`
      : undefined
  );

    // Dados estruturados para o Google mostrar preço e ano nos resultados
  useStructuredData(
    vehicle
      ? {
          "@context": "https://schema.org",
          "@type": "Car",
          name: vehicle.name,
          ...(vehicle.description && { description: vehicle.description }),
          ...(vehicle.images?.length && { image: vehicle.images }),
          ...(vehicle.year && { vehicleModelDate: vehicle.year }),
          ...(vehicle.fuel && { fuelType: vehicle.fuel }),
          ...(vehicle.transmission && { vehicleTransmission: vehicle.transmission }),
          ...(parseNumero(vehicle.km) && {
            mileageFromOdometer: {
              "@type": "QuantitativeValue",
              value: parseNumero(vehicle.km),
              unitCode: "KMT",
            },
          }),
          ...(parseNumero(vehicle.seats) && {
            seatingCapacity: parseNumero(vehicle.seats),
          }),
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            ...(parseNumero(vehicle.price) && { price: parseNumero(vehicle.price) }),
            availability:
              vehicle.status === "vendida"
                ? "https://schema.org/SoldOut"
                : vehicle.status === "brevemente"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/InStock",
            itemCondition: "https://schema.org/UsedCondition",
            seller: {
              "@type": "AutoDealer",
              name: "RheinfallCamping",
              areaServed: "Covilhã, Portugal",
            },
          },
        }
      : null
  );

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
  const vendida = vehicle.status === "vendida";

  const gallery = vehicle.images?.length ? vehicle.images : vehicle.image ? [vehicle.image] : [];
  const hasMultiple = gallery.length > 1;
  const currentPhoto = gallery[photoIndex] ?? gallery[0];

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % gallery.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + gallery.length) % gallery.length);

  const specs = [
    { label: "Ano", value: vehicle.year },
    { label: "Livrete", value: vehicle.registration },
    { label: "Quilómetros", value: vehicle.km },
    { label: "Motor", value: vehicle.engine },
    { label: "Potência", value: vehicle.power },
    { label: "Combustível", value: vehicle.fuel },
    { label: "Transmissão", value: vehicle.transmission },
    { label: "Lugares", value: vehicle.seats },
    { label: "Camas", value: vehicle.beds },
    { label: "Estado", value: vehicle.condition },
    { label: "Garantia", value: vehicle.warranty },
  ].filter((s) => s.value);

  const equipamento = vehicle.features?.filter(Boolean) ?? [];

  const enviar = (e: React.FormEvent | React.MouseEvent, tipo: "visita" | "proposta") => {
    e.preventDefault();

    if (!form.nome.trim() || !form.contacto.trim()) {
      setErro("Por favor preencha o nome e o contacto.");
      return;
    }

    const intro = vendida
      ? `Olá! Chamo-me ${form.nome.trim()}. Vi que a ${vehicle.name} já foi vendida — gostava de ser avisado se entrar alguma parecida.`
      : tipo === "proposta"
      ? `Olá! Chamo-me ${form.nome.trim()} e gostava de fazer uma proposta para a ${vehicle.name}.`
      : brevemente
      ? `Olá! Chamo-me ${form.nome.trim()} e gostava de ser avisado quando a ${vehicle.name} chegar ao stand.`
      : `Olá! Chamo-me ${form.nome.trim()} e gostava de agendar uma visita para ver a ${vehicle.name}.`;

    const mensagem = [intro, `O meu contacto: ${form.contacto.trim()}`].join("\n");
    window.open(whatsappLink(mensagem), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-[#f4f4f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 md:py-12">

        <button
          onClick={() => navigate("/stock")}
          className="inline-flex items-center gap-2 text-black/60 hover:text-black text-sm font-medium transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Voltar ao stock
        </button>

        <div className="mb-10">
          <span
            className={`inline-block text-white text-[0.6875rem] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 ${
              vendida ? "bg-[#b02020]" : brevemente ? "bg-[#C2A07A]" : "bg-[#2f7d4f]"
            }`}
          >
            {vendida ? "Vendida" : brevemente ? "Brevemente em stock" : "Para venda"}
          </span>
          <h1 className="text-black text-3xl md:text-4xl font-medium mb-3">
            {vehicle.name}
          </h1>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            {vehicle.price && !vendida && (
              <p className="text-black text-3xl font-medium">{vehicle.price}</p>
            )}
            <div className="flex items-center gap-3 text-black/50 text-sm">
              {vehicle.year && <span>{vehicle.year}</span>}
              {vehicle.year && vehicle.km && <span className="w-px h-3 bg-black/20" />}
              {vehicle.km && <span>{vehicle.km}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          <div className="lg:col-span-2">

            {gallery.length > 0 ? (
              <div className="mb-10">
                <div className="relative rounded-2xl overflow-hidden bg-[#1c1c1c] aspect-[4/3] sm:aspect-[16/10]">
                  <img
                    src={currentPhoto}
                    alt={`${vehicle.name} — foto ${photoIndex + 1}`}
                    className={`w-full h-full object-cover ${vendida ? "grayscale-[35%]" : ""}`}
                  />

                  {hasMultiple && (
                    <>
                      <button
                        onClick={prevPhoto}
                        aria-label="Foto anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextPhoto}
                        aria-label="Foto seguinte"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full">
                        {photoIndex + 1} / {gallery.length}
                      </span>
                    </>
                  )}
                </div>

                {hasMultiple && (
                  <div className="flex gap-2.5 overflow-x-auto mt-3 pb-1">
                    {gallery.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          i === photoIndex
                            ? "border-black"
                            : "border-transparent opacity-55 hover:opacity-100"
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-10 rounded-2xl bg-[#e6e6e3] aspect-[16/10] flex flex-col items-center justify-center text-black/30">
                <ImageIcon size={40} />
                <span className="text-sm mt-3">Fotos brevemente disponíveis</span>
              </div>
            )}

            {vehicle.description && (
              <div className="mb-10">
                <h3 className="text-xl font-medium mb-4">Descrição</h3>
                <p className="text-black/80 text-[0.9375rem] leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {specs.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-medium mb-5">Especificações</h3>
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-y divide-black/5">
                    {specs.map((spec) => (
                      <div key={spec.label} className="p-4 md:p-5">
                        <span className="block text-xs uppercase tracking-wider text-black/40 mb-1">
                          {spec.label}
                        </span>
                        <span className="font-medium text-black text-[0.9375rem]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {equipamento.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-5">Equipamento</h3>
                <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {equipamento.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-black/80 text-sm">
                        <Check size={16} className="text-[#C2A07A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <ShareButtons titulo={vehicle.name} />
          </div>

          <div className="lg:col-span-1">
            <div
              className={`rounded-3xl p-8 lg:sticky lg:top-24 shadow-lg text-white ${
                vendida ? "bg-[#2a2a2a]" : "bg-[#C2A07A]"
              }`}
            >
              <h3 className="text-xl font-medium mb-2">
                {vendida ? "Mais um cliente satisfeito" : "Tem interesse?"}
              </h3>
              <p className="text-white/80 text-sm mb-8">
                {vendida
                  ? "Esta autocaravana já foi entregue ao novo dono. Procura algo parecido? Deixe o contacto e avisamos quando entrar algo semelhante."
                  : brevemente
                  ? "Esta autocaravana ainda não chegou ao nosso stand. Deixe o seu contacto e avisamos assim que estiver disponível."
                  : "Deixe o seu contacto para agendarmos uma visita ou para fazer uma proposta."}
              </p>

              <form className="space-y-4" onSubmit={(e) => enviar(e, "visita")}>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => { setForm({ ...form, nome: e.target.value }); setErro(""); }}
                  placeholder="Nome"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all"
                />
                <input
                  type="text"
                  value={form.contacto}
                  onChange={(e) => { setForm({ ...form, contacto: e.target.value }); setErro(""); }}
                  placeholder="Email ou Telefone"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white focus:bg-white/15 transition-all"
                />

                {erro && <p className="text-white text-sm bg-black/25 rounded-lg px-3 py-2">{erro}</p>}

                <button
                  type="submit"
                  className="w-full bg-white text-black text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/90 transition-colors mt-2 shadow-sm"
                >
                  {vendida
                    ? "Avisar-me de algo semelhante"
                    : brevemente
                    ? "Avisar-me quando chegar"
                    : "Agendar Visita"}
                </button>
                {!brevemente && !vendida && (
                  <button
                    type="button"
                    onClick={(e) => enviar(e, "proposta")}
                    className="w-full bg-transparent border border-white/30 text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Fazer Proposta
                  </button>
                )}

                <p className="text-white/60 text-xs text-center pt-1">
                  Abre o WhatsApp com a sua mensagem já preenchida.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPage;