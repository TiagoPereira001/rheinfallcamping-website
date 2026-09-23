import { useEffect } from "react";
import { useLocation } from "react-router";

// Sem isto, o React Router mantém a posição de scroll do <main> entre
// navegações — quem clica "Ver detalhes" a meio da lista de stock aterra
// a meio da página seguinte, sem ver a foto/nome/preço do topo.
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
