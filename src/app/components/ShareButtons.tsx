import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

function ShareButtons({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const texto = `Vê esta autocaravana: ${titulo}`;

  const temPartilhaNativa =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const partilharNativo = async () => {
    try {
      await navigator.share({ title: titulo, text: texto, url });
    } catch {
      // O utilizador cancelou — não é erro
    }
  };

  const abrirWhatsApp = () => {
    const link = `https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Alguns browsers bloqueiam — ignoramos
    }
  };

  const estiloBotao =
    "inline-flex items-center gap-2 border border-black/15 text-black text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-black/10">
      <span className="text-black/50 text-sm mr-1">Partilhar:</span>

      {temPartilhaNativa ? (
        <button onClick={partilharNativo} className={estiloBotao}>
          <Share2 size={15} />
          Partilhar
        </button>
      ) : (
        <button
          onClick={abrirWhatsApp}
          className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={15} />
          WhatsApp
        </button>
      )}

      <button onClick={copiarLink} className={estiloBotao}>
        {copiado ? <Check size={15} className="text-[#2f7d4f]" /> : <Link2 size={15} />}
        {copiado ? "Copiado" : "Copiar link"}
      </button>
    </div>
  );
}

export default ShareButtons;