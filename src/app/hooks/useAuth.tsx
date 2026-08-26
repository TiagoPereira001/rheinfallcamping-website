import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthContexto = {
  utilizador: User | null;
  aCarregar: boolean;
  entrar: (email: string, password: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [utilizador, setUtilizador] = useState<User | null>(null);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    // O Firebase avisa-nos sempre que a sessão muda (entrar, sair, expirar)
    const parar = onAuthStateChanged(auth, (u) => {
      setUtilizador(u);
      setACarregar(false);
    });
    return parar;
  }, []);

  const entrar = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const sair = async () => {
    await signOut(auth);
  };

  return (
    <Contexto.Provider value={{ utilizador, aCarregar, entrar, sair }}>
      {children}
    </Contexto.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useAuth tem de estar dentro de <AuthProvider>");
  return ctx;
}