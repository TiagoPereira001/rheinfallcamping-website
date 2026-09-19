import { useEffect, useState, useCallback } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type Lead = {
  id: string;
  nome: string; contacto: string; marca: string;
  ano: string; km: string; preco: string; notas: string;
  tratado: boolean;
  criadoEm: string | null; // ISO — vem já convertido pela Cloud Function
};

const listLeads = httpsCallable<void, Lead[]>(functions, "listLeads");

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setACarregar(true);
    try {
      const resultado = await listLeads();
      setLeads(resultado.data);
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