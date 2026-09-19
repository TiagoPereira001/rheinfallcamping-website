# CLAUDE.md

## Comandos
- `npm run dev` — dev server (Vite, `localhost:5173`)
- `npm run build` — build produção (`vite build`)
- `npm run typecheck` — `tsc --noEmit`, **correr sempre antes de considerar uma alteração terminada**
- Lint: **não configurado** (sem ESLint no repo)
- Testes: **não configurados** (sem test runner)
- Cloud Functions (`functions/`): `cd functions && npm run build` (tsc próprio, `tsconfig.json` separado, excluído do tsconfig raiz)

## Stack / arquitetura
- React 18.3 + TypeScript + Vite 6 + React Router 7 (client-side, `BrowserRouter`)
- Tailwind CSS v4 via `@tailwindcss/vite` — não adicionar `tailwindcss`/`autoprefixer` a `postcss.config.mjs`, fica vazio de propósito
- Firebase: Firestore (leitura pública de `vehicles`) + Auth (login em `/admin`, custom claim `admin: true`) + **Cloud Functions** (todas as escritas)
- Deploy do site: Cloudflare Pages, push para `main` publica automaticamente. Cloud Functions **não** publicam sozinhas — exigem `firebase deploy --only functions` manual

## Padrões de pastas (seguir sempre)
- `src/app/pages/` — uma página por rota; rotas registadas em `src/app/App.tsx`
- `src/app/components/` — componentes partilhados
- `src/app/hooks/` — todo o acesso a Firestore/Auth/Functions vive aqui (`useVehicles`, `useLeads`, `useAuth`); **nunca** chamar Firestore/Functions direto de um componente de página sem passar por um hook
- `src/app/data/config.ts` — única fonte de constantes do negócio (WhatsApp, `phoneDisplay`) — não duplicar valores calculados noutro ficheiro
- `src/app/lib/firebase.ts` — única inicialização do Firebase (`app`, `db`, `functions`)
- `functions/src/index.ts` — todos os endpoints `onCall`; `functions/src/validation.ts` — validação de input, nunca confiar em dados do cliente sem passar por aqui
- Nomes de funções/variáveis em português (`carregar`, `gravar`, `apagar`, `aCarregar`, `aEnviar`) — manter a convenção existente, não misturar inglês

## Restrições críticas
- **Nunca `git push` sem confirmação explícita** — dispara deploy automático em produção
- **Escritas em `vehicles`/`leads` passam sempre por Cloud Functions** (`createVehicle`, `updateVehicle`, `deleteVehicle`, `submitLead`, `setLeadTratado`, `deleteLead`, `createVehicleUpload`) — nunca voltar a escrever direto no Firestore a partir do browser (`addDoc`/`updateDoc`/`deleteDoc`); o Firestore está de propósito fechado a isso (ver `firestore.rules`)
- Depois de `createVehicle`/`updateVehicle`/`deleteVehicle` (em `AdminPage.tsx`), chamar sempre `invalidateVehiclesCache()` (de `useVehicles.ts`) — senão o stock público fica com dados desatualizados
- Região das Cloud Functions é `europe-west1` — `getFunctions(app, "europe-west1")` em `lib/firebase.ts` tem de corresponder sempre à `REGION` em `functions/src/index.ts`
- Nunca `firebase deploy --only firestore:rules` nem `--only functions` sem confirmar o conteúdo antes — infraestrutura partilhada de produção
- Secrets das functions (`RATE_LIMIT_SALT`, `CLOUDINARY_CONFIG`) vivem no Secret Manager do Firebase — nunca em código, `.env`, ou como argumento visível
- Não reintroduzir `src/app/components/ui/` nem `components/figma/` (template shadcn/figma morto, removido de propósito) nem reinstalar os pacotes Radix/MUI/etc. que dependiam deles
- `react` e `react-dom` são `dependencies` diretas — não voltar a movê-los para `peerDependencies`
- `.env.local` nunca vai para o git (está no `.gitignore`); chaves do Firebase aí não são secretas — a proteção real são as regras do Firestore + as Cloud Functions
