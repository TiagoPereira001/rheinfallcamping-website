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
| Funções privadas | Cloud Functions for Firebase (2.ª geração) |
| Fotos | Cloudinary (upload assinado pelo servidor) |
| Alojamento | Netlify |
| Ícones | Lucide React |

---

## Correr localmente

Requisitos: Node.js 20 para as funções (a interface continua a funcionar com Node.js 18+).

```bash
npm install
npm --prefix functions ci
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
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=...
```

Os valores Firebase e a chave pública do reCAPTCHA Enterprise estão em Firebase → Definições do projeto → As suas apps / App Check. Em desenvolvimento local, registe um token de depuração no App Check e acrescente-o apenas ao `.env.local`:

```
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=...
```

> A configuração Firebase e a chave do reCAPTCHA são públicas por desenho. Nunca ponha o `apiSecret` da Cloudinary, uma service account, nem segredos de funções em variáveis `VITE_*`.

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
│   ├── data/                config.ts (contactos), vehicles.ts (navegação)
│   └── lib/                 Firebase, chamadas seguras às funções e utilitários
└── styles/
functions/
├── src/                     Validação e operações privilegiadas no servidor
└── scripts/                 Atribuição/revogação da role de administrador
```

---

## Gerir o stock

O stock vive no **Firestore**, na coleção `vehicles`. Alterar dados não exige publicar o site.

Faça-o pela área **`/admin`**. O browser não tem permissão de escrita no Firestore; as alterações são validadas no servidor e só uma conta com a claim `admin: true` e email confirmado as pode executar.

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

## Publicar a alteração de segurança

Esta alteração só fica protegida depois de publicar **as funções, as regras e o frontend**. Não publique apenas o site Netlify.

1. No Firebase CLI, associe esta pasta ao projeto: `firebase use --add`.
2. Configure o App Check com reCAPTCHA Enterprise para a app web. Acrescente `rheinfallcamping.pt` e `www.rheinfallcamping.pt` aos domínios permitidos; guarde a site key em `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` nas variáveis da Netlify. Não use o token de depuração em produção.
3. No Cloudinary, desative/apague o preset unsigned antigo `nnzokwtg`. Crie um preset **signed** para imagens em `vehicles`, sem overwrite, limitado a JPG/JPEG, PNG, WebP e AVIF e a 10 MB. Depois crie os segredos, sem os guardar no repositório:

   ```bash
   firebase functions:secrets:set RATE_LIMIT_SALT
   firebase functions:secrets:set CLOUDINARY_CONFIG
   ```

   O valor de `CLOUDINARY_CONFIG` é JSON: `{"cloudName":"...","apiKey":"...","apiSecret":"...","uploadPreset":"..."}`.

4. Publique o backend e as regras: `firebase deploy --only functions,firestore:rules`.
5. Faça o deploy normal da Netlify (push para `main`) com a nova variável `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`.
6. Em Firebase → App Check, confirme que há tráfego válido e ative enforcement para **Cloud Firestore**. As callable functions já têm enforcement no código.

As funções de 2.ª geração e Secret Manager exigem faturação ativa no projeto Firebase/Google Cloud. Configure uma política de TTL na coleção `securityRateLimits` usando o campo `expiraEm`, para limpar contadores antigos.

Antes de cada publicação, valide:

```bash
npm run build
npm run functions:check
```

O ficheiro `public/_headers` é publicado pela Netlify e aplica CSP, proteção contra framing, MIME sniffing, referrer leakage e permissões de browser desnecessárias.

---

## Segurança

- O Firestore expõe apenas leitura do catálogo. Leads, alterações de stock, limitações de taxa e qualquer outra coleção são negados ao cliente por defeito.
- As operações administrativas exigem uma custom claim `admin: true`, email confirmado, Firebase Auth e App Check. A verificação visual em `/admin` é apenas conveniência; o servidor decide sempre.
- O formulário público passa por App Check, honeypot, validação estrita e máximo de 3 pedidos por IP/hora (guardado sob hash HMAC, não o IP em texto).
- O upload recebe uma assinatura curta emitida apenas ao administrador. O segredo da Cloudinary fica no Secret Manager e o preset unsigned deixa de existir.
- A sessão administrativa usa persistência de sessão, não armazenamento permanente no navegador.

### Fechar a criação pública de contas

O endpoint de criação de contas do Firebase Auth faz parte da API pública quando Email/Password está ativo. Uma conta criada por terceiros **não obtém** a claim `admin` nem acesso ao painel ou aos dados com esta arquitetura; mesmo assim, desative já a criação e eliminação de contas por utilizadores finais em Firebase Authentication → Settings → *User actions*. Crie novos administradores apenas na consola ou com o Admin SDK.

Ative também a proteção contra enumeração de emails, uma password policy forte e MFA para as contas que administram o projeto Firebase/Google Cloud.

### Dar acesso administrativo

1. Crie a conta manualmente em Firebase Authentication, confirme o email e mantenha Email/Password apenas como método de entrada.
2. Com credenciais de uma service account fora do repositório, atribua a claim:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/caminho/seguro/service-account.json \
   npm --prefix functions run admin:set -- admin@exemplo.pt
   ```

3. A pessoa deve sair e voltar a entrar para receber o novo token. Para revogar: acrescente `--revoke` no fim do comando e, se necessário, desative a conta na consola.

As regras atuais estão em [`firestore.rules`](firestore.rules); não volte a usar `allow write: if request.auth != null`.
