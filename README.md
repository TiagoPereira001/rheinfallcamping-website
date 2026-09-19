# RheinfallCamping

Site de compra e venda de autocaravanas usadas, na zona da Covilhã.

**Em produção:** [rheinfallcamping.pt](https://rheinfallcamping.pt)

---

## O que faz

- **Catálogo de stock** com filtros por preço, ano e marca, e paginação
- **Página por autocaravana** com galeria de fotos, especificações e equipamento
- **Estados de venda** — para venda, brevemente, vendida
- **Contactos** — formulários que abrem o WhatsApp com a mensagem já preenchida
- **Página de compra** — quem quer vender uma autocaravana submete os dados
- **Área interna** (`/admin`) — gestão de stock com login, incluindo upload de fotos

---

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 18 + TypeScript |
| Build | Vite 6 |
| Estilos | TailwindCSS |
| Rotas | React Router 7 |
| Base de dados | Firebase Firestore |
| Autenticação | Firebase Auth |
| Fotos | Cloudinary (upload assinado via Cloud Function) |
| Alojamento | Cloudflare Pages |
| Backend | Cloud Functions (Firebase, região `europe-west1`) |
| Ícones | Lucide React |

---

## Correr localmente

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

O site fica em `http://localhost:5173`.

### Variáveis de ambiente

Cria um ficheiro `.env.local` na raiz com a configuração do Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Estes valores estão em Firebase → Definições do projeto → As suas apps.

> A configuração do Firebase não é secreta — fica sempre visível no código que corre no browser. O que protege os dados são as regras do Firestore.

---

## Estrutura

```
src/
├── main.tsx                 Ponto de entrada, monta o router e a autenticação
├── app/
│   ├── App.tsx              Rotas
│   ├── components/          Header, Footer, VehicleCard, ImageUploader, ShareButtons
│   ├── pages/               Home, Stock, VehicleDetail, Contactos, Vender, Admin, 404
│   ├── hooks/               useVehicles (dados + cache), useAuth, usePageTitle
│   ├── data/                config.ts (contactos, Cloudinary), vehicles.ts (navegação)
│   └── lib/                 firebase.ts, utils.ts
└── styles/
```

---

## Gerir o stock

O stock vive no **Firestore**, na coleção `vehicles`. Alterar dados não exige publicar o site.

Há duas formas de o fazer:

1. **`/admin` no site** — com login. Adiciona, edita e remove autocaravanas, e faz upload de fotos direto do telemóvel.
2. **Consola do Firebase** — em alternativa, editando os documentos à mão.

### Campos de cada autocaravana

Só o `name` é obrigatório. Tudo o resto é opcional: o que não estiver preenchido simplesmente não aparece no site.

| Campo | Tipo | Exemplo |
|---|---|---|
| `name` | string | `Fiat Dethleffs Trend` |
| `price` | string | `€ 35.000` |
| `year` | string | `2005` |
| `km` | string | `78.000 km` |
| `status` | string | vazio, `brevemente` ou `vendida` |
| `images` | array | URLs das fotos — a primeira é a principal |
| `features` | array | Lista de equipamento |
| `description` | string | Texto livre |
| `registration`, `engine`, `power`, `fuel`, `transmission`, `seats`, `beds`, `condition`, `warranty` | string | Dados técnicos |

> O `name` deve começar pela marca, porque é dela que sai o filtro de marcas na página de stock.

---

## Publicar

O deploy do site é automático: cada `git push` para `main` desencadeia uma nova publicação na Cloudflare Pages.

Antes de fazer push, convém correr `npm run build` localmente para apanhar erros primeiro.

As Cloud Functions (`functions/`) **não** publicam sozinhas — exigem `firebase deploy --only functions` manual. Ver `functions/README.md` (ou a secção de Segurança abaixo) para o que precisa de estar configurado antes do primeiro deploy.

---

## Segurança

- As contas de acesso ao `/admin` são criadas manualmente na consola do Firebase, com o custom claim `admin: true`. **Não existe registo público.**
- Todas as escritas (veículos, pedidos de venda, upload de fotos) passam por **Cloud Functions** (`functions/src/index.ts`), não por escrita direta do browser ao Firestore. Cada função re-verifica o claim de admin, valida os campos recebidos e aplica rate limiting (pedidos de venda: 3/hora por IP).
- O Firestore está fechado a escrita direta — só leitura pública de `vehicles`. Ver `firestore.rules`.
- O upload de fotos usa assinatura gerada pela Cloud Function `createVehicleUpload` (preset "signed" da Cloudinary) — a `api_secret` nunca chega ao browser.
- O `.env.local` está no `.gitignore` e nunca deve ser enviado para o repositório. As secrets das Cloud Functions (`RATE_LIMIT_SALT`, `CLOUDINARY_CONFIG`) vivem no Secret Manager do Firebase, não no código.

### Regras do Firestore

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicles/{vehicleId} {
      allow get, list: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
