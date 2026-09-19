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

### 4. Deploy

```bash
firebase deploy --only functions
```

O site (`npm run build` + Cloudflare Pages) não inclui isto — é sempre manual.

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
