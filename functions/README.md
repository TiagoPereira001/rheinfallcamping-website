# Cloud Functions — RheinfallCamping

Backend que trata de todas as escritas (veículos, pedidos de venda, upload de fotos).
O Firestore está fechado a escrita direta (`firestore.rules`) — só estas funções, com
a Admin SDK, conseguem escrever.

## Antes do primeiro deploy

Passos que só tu consegues fazer (precisam do teu Firebase CLI autenticado):

### 1. Instalar dependências

```bash
cd functions
npm install
```

### 2. Secrets

Duas secrets, guardadas no Secret Manager do Firebase (nunca em código):

```bash
firebase functions:secrets:set RATE_LIMIT_SALT
# cola uma string aleatória qualquer (ex: gerada com `openssl rand -hex 32`)

firebase functions:secrets:set CLOUDINARY_CONFIG
# cola um JSON de uma linha, ex:
# {"apiKey":"...","apiSecret":"...","cloudName":"qqiezhhd","uploadPreset":"nnzokwtg"}
```

`cloudName` (`qqiezhhd`) e `uploadPreset` (`nnzokwtg`) são os valores que já estavam
no site. `apiKey`/`apiSecret` tiram-se em Cloudinary → Settings → API Keys — nunca
estiveram no código, porque `apiSecret` não pode estar no browser.

### 3. Custom claim do admin

Não há UI na Consola do Firebase para isto — precisa da Admin SDK, uma vez:

```bash
# 1. Consola do Firebase -> Definições do projeto -> Contas de serviço
#    -> "Gerar nova chave privada" (fica FORA do repositório, nunca no git)
cd functions
GOOGLE_APPLICATION_CREDENTIALS=/caminho/para/chave.json \
  node scripts/set-admin-claim.js email@do-admin.com
```

Repete sempre que precisares de dar acesso a outro email. Depois de correr, esse
utilizador tem de voltar a fazer login no `/admin` para o token atualizar.

### 4. Deploy — functions E regras do Firestore

```bash
firebase deploy --only functions
firebase deploy --only firestore:rules
```

**As duas são necessárias, não só a primeira.** As regras que estão ativas no
projeto agora (confirmadas em 2026-09-20) ainda são o modelo antigo — permitem
`create` em `leads` sem autenticação nenhuma, só com validação de campos. Isso
significa que, mesmo depois de publicares as functions, alguém consegue continuar
a escrever direto na coleção `leads` pela API do Firestore, **sem passar pelo
rate limiting** de `submitLead` (3 pedidos/hora por IP) — o limite fica
decorativo enquanto essa regra antiga continuar ativa.

O `firestore.rules` deste repositório já está no estado certo para o modelo
atual (só leitura pública de `vehicles`, tudo o resto fechado — as escritas
passam a ir só pela Admin SDK dentro das Cloud Functions, que não é afetada
pelas regras). Basta publicá-lo.

O site (`npm run build` + Cloudflare Pages) não inclui nenhum destes dois
deploys — são sempre manuais.

## CORS

`functions/src/index.ts` só aceita pedidos de `https://rheinfallcamping.pt`,
`https://www.rheinfallcamping.pt` e `http://localhost:<porta>`. Se usares deploys de
pré-visualização da Cloudflare Pages (domínios `*.pages.dev`), adiciona-os a
`ORIGENS_PERMITIDAS` antes de testar lá.

## Depois do deploy — verificar

- `/vender` consegue submeter (testa com dados de teste)
- `/admin` → login → adicionar/editar/apagar uma autocaravana
- `/admin` → aba "Pedidos de venda" → marcar como tratado, apagar
- Upload de fotos no formulário de veículo
- Confirmar que a escrita direta ao Firestore ficou mesmo fechada: no
  browser, com a consola do site aberta, tentar
  `firebase.firestore().collection("leads").add({...})` (ou equivalente)
  deve dar `permission-denied` — se não der, as regras antigas ainda
  estão ativas
