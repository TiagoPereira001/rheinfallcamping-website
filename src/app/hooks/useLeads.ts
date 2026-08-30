import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/functions";

export type Lead = {
  id: string;
  nome?: string; contacto?: string; marca?: string;
  ano?: string; km?: string; preco?: string; notas?: string;
  tratado?: boolean;
  criadoEm?: string | null;
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setACarregar(true);
    try {
      setLeads(await api.listLeads());
      setErro("");
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os pedidos.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const porTratar = leads.filter((l) => !l.tratado).length;

  return { leads, aCarregar, erro, porTratar, recarregar: carregar };
}
