import { useEffect } from "react";

const BASE = "RheinfallCamping";

/**
 * Define o título da página e a meta description.
 * Usar em cada página: usePageTitle("O nosso stock", "descrição...")
 */
export function usePageTitle(titulo?: string, descricao?: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — ${BASE}` : `${BASE} — Autocaravanas usadas na Covilhã`;

    if (descricao) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", descricao);
    }
  }, [titulo, descricao]);
}