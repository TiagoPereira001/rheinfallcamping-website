import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Vehicle = {
  id: string;
  name: string;
  year: string;
  km: string;
  price: string;
  image?: string;
  images?: string[];      // galeria de fotos — se vazio, cai para "image"

  // Campos opcionais — só aparecem no site se estiverem preenchidos no Firestore
  status?: string;        // "brevemente" | "vendida" | ausente = para venda
  description?: string;

  // Dados técnicos
  registration?: string;  // data do livrete, ex: "2016/03"
  engine?: string;        // ex: "2.2 TDCi"
  power?: string;         // ex: "155 cv"
  transmission?: string;  // ex: "Manual"
  fuel?: string;          // ex: "Diesel"
  seats?: string;         // ex: "5 lugares"
  beds?: string;          // ex: "Cama central + basculante"
  condition?: string;     // ex: "Excelente estado"
  warranty?: string;

  // Lista de equipamento (array de texto no Firestore)
  features?: string[];
};

// ---------------------------------------------------------------
// Cache partilhada entre páginas.
// Sem isto, cada navegação voltava a ler a coleção inteira do
// Firestore. Assim lemos uma vez e reutilizamos durante a visita.
// Ao recarregar a página (F5) a cache é limpa e os dados voltam
// a ser lidos — por isso o teu pai vê as alterações na mesma.
// ---------------------------------------------------------------
const CACHE_MS = 5 * 60 * 1000; // 5 minutos

let cache: Vehicle[] | null = null;
let cacheEm = 0;
let pedidoEmCurso: Promise<Vehicle[]> | null = null;

async function carregarVeiculos(): Promise<Vehicle[]> {
  const agora = Date.now();

  if (cache && agora - cacheEm < CACHE_MS) {
    return cache;
  }

  // Se já houver um pedido a decorrer, aproveitamos o mesmo em vez
  // de lançar outro (evita leituras duplicadas quando duas partes
  // da página pedem os dados ao mesmo tempo).
  if (pedidoEmCurso) {
    return pedidoEmCurso;
  }

  pedidoEmCurso = getDocs(collection(db, "vehicles"))
    .then((snapshot) => {
      const lista = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Vehicle, "id">),
      }));
      cache = lista;
      cacheEm = Date.now();
      return lista;
    })
    .finally(() => {
      pedidoEmCurso = null;
    });

  return pedidoEmCurso;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    carregarVeiculos()
      .then((lista) => {
        if (!ativo) return;
        setVehicles(lista);
      })
      .catch((err) => {
        if (!ativo) return;
        console.error("Erro ao carregar veículos:", err);
        setError("Não foi possível carregar o stock.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return { vehicles, loading, error };
}

// ---------------------------------------------------------------
// Lê apenas UM veículo. Usado na página de detalhe.
// Antes lia a coleção toda só para encontrar um — com 30 veículos
// em stock isso eram 30 leituras em vez de 1.
// ---------------------------------------------------------------
export function useVehicle(id?: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    if (!id) {
      setLoading(false);
      return;
    }

    // Se já tivermos a lista em cache, evitamos ir ao Firestore
    const emCache = cache?.find((v) => v.id === id);
    if (emCache) {
      setVehicle(emCache);
      setLoading(false);
      return;
    }

    getDoc(doc(db, "vehicles", id))
      .then((snap) => {
        if (!ativo) return;
        if (snap.exists()) {
          setVehicle({ id: snap.id, ...(snap.data() as Omit<Vehicle, "id">) });
        } else {
          setVehicle(null);
        }
      })
      .catch((err) => {
        if (!ativo) return;
        console.error("Erro ao carregar veículo:", err);
        setError("Não foi possível carregar esta autocaravana.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  return { vehicle, loading, error };
}
