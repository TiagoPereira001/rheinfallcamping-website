import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);

const ADMIN_UID = "DyijvXsSBzgL5SJgtWI8DedxTkk2";

type AuthContexto = {
  utilizador: User | null;
  isAdmin: boolean;
  aCarregar: boolean;
  entrar: (email: string, password: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [utilizador, setUtilizador] = useState<User | null>(null);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    const parar = onAuthStateChanged(auth, (u) => {
      setUtilizador(u);
      setACarregar(false);
    });

    return parar;
  }, []);

  const entrar = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const sair = async () => {
    await signOut(auth);
  };

  const isAdmin = utilizador?.uid === ADMIN_UID;

  return (
    <Contexto.Provider
      value={{
        utilizador,
        isAdmin,
        aCarregar,
        entrar,
        sair,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Contexto);

  if (!ctx) {
    throw new Error("useAuth tem de estar dentro de <AuthProvider>");
  }

  return ctx;
}