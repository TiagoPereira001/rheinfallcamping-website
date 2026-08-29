import { useEffect } from "react";

const ID = "dados-estruturados";

function serializarSeguro(dados: object) {
  return JSON.stringify(dados)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function useStructuredData(dados: object | null) {
  useEffect(() => {
    document.getElementById(ID)?.remove();

    if (!dados) {
      return;
    }

    const script = document.createElement("script");

    script.id = ID;
    script.type = "application/ld+json";
    script.textContent = serializarSeguro(dados);

    document.head.appendChild(script);

    return () => {
      document.getElementById(ID)?.remove();
    };
  }, [dados]);
}