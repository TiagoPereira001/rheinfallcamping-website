import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [email, acao] = process.argv.slice(2);

if (!email || !/^\S+@\S+\.\S+$/.test(email) || (acao && acao !== "--revoke")) {
  console.error("Uso: npm run admin:set -- email@exemplo.pt [--revoke]");
  process.exitCode = 1;
} else {
  if (!getApps().length) {
    initializeApp({ credential: applicationDefault() });
  }

  const auth = getAuth();
  const utilizador = await auth.getUserByEmail(email);

  if (!utilizador.emailVerified && acao !== "--revoke") {
    throw new Error("Confirme o email da conta antes de lhe atribuir acesso administrativo.");
  }

  const claims = { ...(utilizador.customClaims ?? {}) };
  if (acao === "--revoke") {
    delete claims.admin;
  } else {
    claims.admin = true;
  }

  await auth.setCustomUserClaims(utilizador.uid, claims);
  await auth.revokeRefreshTokens(utilizador.uid);
  console.log(acao === "--revoke" ? "Acesso administrativo removido." : "Acesso administrativo atribuído.");
}
