import { createContext, useContext, useEffect, useState } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [aCarregar, setACarregar] = useState(true);

  useEffect(() => {
    let ativo = true;

    const parar = onIdTokenChanged(auth, async (u) => {
      if (!ativo) return;

      setUtilizador(u);

      if (!u) {
        setIsAdmin(false);
        setACarregar(false);
        return;
      }

      try {
        const token = await u.getIdTokenResult();
        if (!ativo) return;

        setIsAdmin(token.claims.admin === true && u.emailVerified);
      } catch {
        if (ativo) setIsAdmin(false);
      } finally {
        if (ativo) setACarregar(false);
      }
    });

    return () => {
      ativo = false;
      parar();
    };
  }, []);

  const entrar = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const sair = async () => {
    await signOut(auth);
  };

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
