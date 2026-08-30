import { useEffect, useState } from "react";

const CHAVE = "rc_consentimento";
const GA_ID = "G-4JYP96Y5BT";

type Estado = "aceite" | "recusado" | null;

// Carrega o Google Analytics apenas quando há consentimento
function carregarAnalytics() {
  if (document.getElementById("ga-script")) return;

  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const inline = document.createElement("script");
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(inline);
}

export function useConsentimento() {
  const [estado, setEstado] = useState<Estado>(null);
  const [decidido, setDecidido] = useState(true);

  useEffect(() => {
    let guardado: Estado = null;
    try {
      guardado = localStorage.getItem(CHAVE) as Estado;
    } catch {
      // Alguns browsers bloqueiam o localStorage
    }

    setEstado(guardado);
    setDecidido(guardado !== null);

    if (guardado === "aceite") carregarAnalytics();
  }, []);

  const decidir = (novo: "aceite" | "recusado") => {
    try {
      localStorage.setItem(CHAVE, novo);
    } catch {
      // Se não der para guardar, a decisão vale só para esta visita
    }
    setEstado(novo);
    setDecidido(true);
    if (novo === "aceite") carregarAnalytics();
  };

  return { estado, decidido, decidir };
}