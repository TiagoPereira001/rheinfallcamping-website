import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { browserSessionPersistence, initializeAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

function obrigatoria(nome: string): string {
  const valor = import.meta.env[nome] as string | undefined;

  if (!valor) {
    throw new Error(`Falta a variável de ambiente ${nome}.`);
  }

  return valor;
}

const firebaseConfig = {
  apiKey: obrigatoria("VITE_FIREBASE_API_KEY"),
  authDomain: obrigatoria("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: obrigatoria("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: obrigatoria("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: obrigatoria("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: obrigatoria("VITE_FIREBASE_APP_ID"),
};

export const app = initializeApp(firebaseConfig);

// App Check fica opcional enquanto a site key ainda não estiver configurada.
// Quando a chave existir na Netlify/.env.local, o App Check é ativado
// automaticamente sem impedir o site de arrancar quando a configuração ainda
// não foi feita.
const appCheckSiteKey = import.meta.env
  .VITE_RECAPTCHA_ENTERPRISE_SITE_KEY as string | undefined;

if (appCheckSiteKey) {
  if (import.meta.env.DEV) {
    const debugToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN as
      | string
      | undefined;

    if (debugToken) {
      (globalThis as typeof globalThis & {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: string;
      }).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
    }
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else if (import.meta.env.DEV) {
  console.warn(
    "Firebase App Check não está configurado. Configure VITE_RECAPTCHA_ENTERPRISE_SITE_KEY antes de ativar o enforcement no backend.",
  );
}

// A sessão administrativa fica apenas no armazenamento de sessão do browser.
// Não fica persistida entre sessões do navegador.
export const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});

// A cache fica apenas na memória desta sessão.
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});
