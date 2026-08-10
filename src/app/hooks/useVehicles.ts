import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Vehicle = {
  id: string;
  name: string;
  year: string;
  km: string;
  price: string;
  image: string;
  // Campos opcionais — só aparecem no site se estiverem preenchidos no Firestore
  status?: string;        // ex: "brevemente"
  description?: string;
  transmission?: string;
  fuel?: string;
  seats?: string;
  warranty?: string;
};

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const snapshot = await getDocs(collection(db, "vehicles"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Vehicle, "id">),
        }));
        setVehicles(list);
      } catch (err) {
        console.error("Erro ao carregar veículos:", err);
        setError("Não foi possível carregar o stock.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { vehicles, loading, error };
}