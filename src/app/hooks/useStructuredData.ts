import { useEffect } from "react";

const ID = "dados-estruturados";

/**
 * Injeta dados estruturados (schema.org) na página, em JSON-LD.
 * O Google usa isto para mostrar preço, ano e disponibilidade
 * diretamente nos resultados de pesquisa.
 */
export function useStructuredData(dados: object | null) {
  useEffect(() => {
    // Remove o anterior, se existir, para não acumular ao navegar
    document.getElementById(ID)?.remove();

    if (!dados) return;

    const script = document.createElement("script");
    script.id = ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(dados);
    document.head.appendChild(script);

    return () => {
      document.getElementById(ID)?.remove();
    };
  }, [dados]);
}