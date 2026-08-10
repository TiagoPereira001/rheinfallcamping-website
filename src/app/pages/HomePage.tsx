import { Link, useNavigate } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import VehicleCard from "../components/VehicleCard";

// Fotos da página inicial. Mete os ficheiros em public/images/
// e escreve aqui o caminho. Deixa null para não mostrar foto.
const HERO_IMAGE: string | null = "/images/foto_padrao.jpeg"
const SOBRE_NOS_IMAGE: string | null = "/images/sobre_nos.jpg";

function HomePage() {
  const navigate = useNavigate();
  const { vehicles, loading, error } = useVehicles();

  return (
    <>
      <section className="bg-black relative overflow-hidden">
        {HERO_IMAGE && (
          <>
            <img
              src={HERO_IMAGE}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Camada escura por cima da foto, para o texto branco continuar legível */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28 md:py-36 lg:py-44">
          <div className="max-w-3xl">
            <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-8 font-sans">
              Projeto familiar · Covilhã
            </p>
            <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-medium leading-[1.08] mb-12">
              Uma nova forma de viajar, com tranquilidade. Compre aqui a sua
              autocaravana de sonho.
            </h1>
            <Link
              to="/stock"
              className="inline-flex items-center gap-3 bg-[#d6d6d4] text-black text-sm font-medium px-7 py-3.5 rounded-full hover:bg-white transition-colors duration-200 group"
            >
              Explorar o stock atual
              <ArrowUpRight
                size={15}
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f2] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-black text-3xl md:text-4xl font-medium">
              Em Destaque
            </h2>
            <Link
              to="/stock"
              className="hidden sm:block text-black/60 hover:text-black text-sm font-medium transition-colors"
            >
              Ver todo o stock &rarr;
            </Link>
          </div>
          {loading && (
            <p className="text-black/50 text-sm">A carregar stock...</p>
          )}
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.slice(0, 3).map((v) => (
                <VehicleCard key={v.id} v={v} onClick={() => navigate(`/stock/${v.id}`)} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/stock"
              className="text-black text-sm font-medium underline underline-offset-4"
            >
              Ver todo o stock
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#C2A07A] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="bg-[#d9cfc0] rounded-2xl h-[340px] md:h-[480px] overflow-hidden relative">
              {SOBRE_NOS_IMAGE && (
                <img
                  src={SOBRE_NOS_IMAGE}
                  alt="A preparação das nossas autocaravanas"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-white/55 text-xs tracking-[0.2em] uppercase mb-6 font-sans">
                Família & Rigor
              </p>
              <h2 className="font-serif text-white text-3xl md:text-4xl font-medium leading-[1.15] mb-7">
                Um projeto familiar, dedicado à estrada.
              </h2>
              <p className="text-white/85 text-[0.9375rem] leading-relaxed mb-5">
                Somos um negócio de família simples e apaixonado por autocaravanas. O que começou como um hobby, tornou-se num projeto honesto, direto e sem complicações. Quando fala connosco, fala com quem prepara e cuida de cada carrinha.
              </p>
              <p className="text-white/85 text-[0.9375rem] leading-relaxed mb-5">
                A mecânica e a fiabilidade são a nossa prioridade. Cada veículo passa por uma inspeção básica e os pontos essenciais são revistos antes da entrega. Queremos garantir que arranca para a sua viagem com segurança, mas sem as margens e os custos exagerados de um stand tradicional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;