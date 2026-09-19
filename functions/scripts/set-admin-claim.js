// Script único, para correr uma vez (ou sempre que trocares o email do admin).
// Dá ao utilizador do Firebase Auth indicado o custom claim `admin: true`,
// que é o que `functions/src/index.ts` (exigirAdmin) exige para deixar
// gravar/apagar veículos ou ver os pedidos de venda.
//
// Como correr:
//   1. Na Consola do Firebase -> Definições do projeto -> Contas de serviço
//      -> "Gerar nova chave privada". Guarda o ficheiro FORA do repositório
//      (nunca vai para o git).
//   2. cd functions
//   3. GOOGLE_APPLICATION_CREDENTIALS=/caminho/para/chave.json \
//        node scripts/set-admin-claim.js email@do-admin.com
//   4. O admin tem de fazer logout/login (ou esperar a sessão expirar) para
//      o novo claim chegar ao token.

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/set-admin-claim.js email@do-admin.com");
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });

getAuth()
  .getUserByEmail(email)
  .then(async (utilizador) => {
    await getAuth().setCustomUserClaims(utilizador.uid, { admin: true });
    console.log(`OK: ${email} (uid ${utilizador.uid}) agora tem admin: true.`);
    console.log("Precisa de voltar a fazer login para o token atualizar.");
  })
  .catch((err) => {
    console.error("Falhou:", err.message);
    process.exit(1);
  });
