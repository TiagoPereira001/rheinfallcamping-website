import { Link } from "react-router";
import { useConsentimento } from "../hooks/useConsentimento";

function CookieBanner() {
  const { decidido, decidir } = useConsentimento();

  if (decidido) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
        <p className="text-black/75 text-sm leading-relaxed flex-1">
          Usamos cookies de análise para perceber como o site é usado. São opcionais
          e pode recusar sem perder nada.{" "}
          <Link to="/privacidade" className="text-black underline underline-offset-2">
            Saber mais
          </Link>
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => decidir("recusado")}
            className="flex-1 sm:flex-none border border-black/25 text-black text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={() => decidir("aceite")}
            className="flex-1 sm:flex-none border border-black/25 bg-black/5 text-black text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-black/10 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;