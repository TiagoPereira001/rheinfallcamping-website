import { Link, useNavigate } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import VehicleCard from "../components/VehicleCard";

// Fotos da página inicial. Mete os ficheiros em public/images/
// e escreve aqui o caminho. Deixa null para não mostrar foto.
const HERO_IMAGE: string | null = "/images/foto_padrao.webp"; 
const SOBRE_NOS_IMAGE: string | null = null; 

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
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.15] mb-6">
              Autocaravanas preparadas por quem percebe e gosta disto.
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Há mais de 10 anos a comprar, preparar e vender autocaravanas na zona da Covilhã. Cada uma é tratada como se fosse para nós.
            </p>
            <Link
              to="/stock"
              className="inline-flex items-center gap-3 bg-white text-black text-sm font-medium px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200 group"
            >
              Ver autocaravanas disponíveis
              <ArrowUpRight
                size={15}
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f2] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-black text-2xl md:text-3xl font-medium">
              Em destaque
            </h2>
            <Link
              to="/stock"
              className="hidden sm:block text-black/60 hover:text-black text-sm font-medium transition-colors"
            >
              Ver todo o stock →
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

      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="bg-[#2a2a2a] rounded-2xl h-[340px] md:h-[480px] overflow-hidden relative">
              {SOBRE_NOS_IMAGE ? (
                <img
                  src={SOBRE_NOS_IMAGE}
                  alt="Preparação de uma autocaravana"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                  Foto em breve
                </div>
              )}
            </div>
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-medium leading-snug mb-6">
                Quem somos
              </h2>
              <p className="text-white/75 text-[0.9375rem] leading-relaxed mb-5">
                Isto começou com um gosto pessoal: o de pegar numa autocaravana e partir sem direção. Com o tempo, esse gosto tornou-se num projeto — comprar, preparar e vender autocaravanas há mais de 10 anos na zona da Covilhã.
              </p>
              <p className="text-white/75 text-[0.9375rem] leading-relaxed mb-5">
                Antes de vender, cada autocaravana é preparada como se fosse para nós. Por dentro e por fora, o objetivo é sempre o mesmo: que o próximo dono receba algo que nós próprios teríamos orgulho em usar.
              </p>
              <p className="text-white/75 text-[0.9375rem] leading-relaxed">
                Não somos um stand grande e não queremos ser. Nos stands grandes, muitas vezes o foco é a margem e não o cliente. Aqui falamos diretamente, sem pressão e sem surpresas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;