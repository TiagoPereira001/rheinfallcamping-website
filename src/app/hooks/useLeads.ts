import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Lead = {
  id: string;
  nome?: string; contacto?: string; marca?: string;
  ano?: string; km?: string; preco?: string; notas?: string;
  tratado?: boolean;
  criadoEm?: { seconds: number };
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setACarregar(true);
    try {
      const q = query(collection(db, "leads"), orderBy("criadoEm", "desc"));
      const snap = await getDocs(q);
      setLeads(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) })));
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