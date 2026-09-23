---
target: "Página de detalhe do veículo (/stock/:id)"
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/tiagopereiradias/Desktop/site pai/src/app/pages/VehicleDetailPage.tsx"
target_fingerprint: "sha256:eda9b956ecf35c0bf84e7253a680ff4b6ee4d89cf641d0bb7de0f63f38678ee7"
target_path: /Users/tiagopereiradias/Desktop/site pai/src/app/pages/VehicleDetailPage.tsx
timestamp: 2026-09-23T10-05-17Z
slug: src-app-pages-vehicledetailpage-tsx
closed: true
---
Method: dual-agent (A: design-review agent · B: detector/browser-evidence agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Nenhuma confirmação depois de abrir o WhatsApp; sem estado "a enviar" visível |
| 2 | Match System / Real World | 3 | Terminologia natural em PT; preço sem separador de milhares ("35000€") |
| 3 | User Control and Freedom | 2 | A posição de scroll não é reposta ao navegar de /stock para /stock/:id (confirmado ao vivo) |
| 4 | Consistency and Standards | 3 | Segue bem os tokens do DESIGN.md, mas este ficheiro viola a própria regra de contraste do sistema |
| 5 | Error Prevention | 2 | Campos obrigatórios verificados, zero validação de formato no campo "contacto" |
| 6 | Recognition Rather Than Recall | 3 | Tudo visível, aria-labels presentes; strip de miniaturas sem indicação clara de "mais fotos" |
| 7 | Flexibility and Efficiency | n/a | Superfície Persuade de sessão única — fluxo de utilizador avançado não se aplica |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo e contido; ritmo do cabeçalho quebra-se de forma desigual sem preço |
| 9 | Error Recovery | 2 | Mensagem de erro em linguagem clara mas genérica — não diz qual campo está vazio |
| 10 | Help and Documentation | n/a | Não aplicável a uma página de listagem única |
| **Total** | | **20/32** | **Aceitável (62.5%)** |

## Design Specificity Verdict

**Fundamentada mas superficial.** O cartão de contacto que muda de cor/copy por estado (verde/dourado "Tem interesse?" → cinzento "Mais um cliente satisfeito") e o fluxo de contacto WhatsApp-primeiro (sem formulário de reserva falso) são genuinamente desta marca e batem certo com o `PRODUCT.md`. Mas sem a cor e o texto, o esqueleto — galeria + miniaturas + tabela de specs + checklist + sidebar fixa — é o mesmo template de qualquer classificados de veículos. O posicionamento central ("cada autocaravana tratada como se fosse da família") só vive na home; nunca reaparece na página onde a decisão de confiança realmente acontece.

**Scan determinístico:** `impeccable detect --json` em `VehicleDetailPage.tsx` e `ShareButtons.tsx` (ficheiros estáticos) devolveu `[]` em ambos — limpo. O detector ao vivo no browser (injetado via live-server, depois parado corretamente) encontrou 5 categorias de anti-padrões:

- **`low-contrast`** — 2.0:1 em `ShareButtons.tsx:51`, texto branco sobre o verde do WhatsApp (`#25D366`) no botão de fallback quando `navigator.share` não existe. Confirmado real, mas condicional (só nesse caminho).
- **`skipped-heading`** — `<h1>` "Fiat Dethleffs" seguido de `<h3>` "Descrição", sem `<h2>` nenhum. Confirmado por leitura direta do código — e a Assessment A, sem ver este resultado, notou exatamente o mesmo problema por si própria. Convergência forte entre os dois métodos.
- **`line-length`** — ~104 carateres/linha no parágrafo de descrição (sem `max-width`/`ch`), que a Assessment A não tinha assinalado como prioridade — achado novo do detector.
- **`edge-flush-cards`** — miniatura encostada à borda do próprio contentor de scroll da galeria. Provável falso positivo: a borda é do contentor interno, não da página (que tem `max-w-7xl` com padding generoso).
- **`overused-font`** — Inter em 100% do texto. Falso positivo por desenho: o `DESIGN.md` documenta isto como escolha deliberada (um único acento serif raro, Inter para tudo o resto), não como falta de variedade.

O cabeçalho do detector disse "4 anti-patterns found" mas listou 5 categorias distintas — pequena inconsistência de contagem da própria ferramenta, sem impacto na substância dos achados.

**Overlays visuais:** a injeção funcionou e o live-server correu, mas foi parado corretamente no fim do processo (como o protocolo exige) — não há overlay persistente visível agora num separador do browser. Se quiseres ver os anti-padrões marcados ao vivo, posso voltar a correr o detector.

## Overall Impression

A página cumpre a função básica — mostra o veículo, deixa contactar — mas fica-se por aí. O maior problema não é estético, é de confiança: um comprador que aterra a meio da página (bug de scroll), vê um preço em falta sem explicação, e não consegue aproximar a única prova real (as fotos) antes de decidir se vale a pena ir à Covilhã. A maior oportunidade única: tratar a fotografia como o produto, não como decoração de lista.

## What's Working

1. **Cartão de contacto consciente do estado** — reescreve-se por completo (cor, título, copy) entre "para venda", "brevemente" e "vendida", em vez de reutilizar um bloco genérico. O texto do estado "vendida" ("Mais um cliente satisfeito... avisamos quando entrar algo semelhante") transforma um beco sem saída em captação de lead sem parecer um truque.
2. **Contacto honesto, WhatsApp primeiro** — reflete o processo real do negócio (só por marcação, WhatsApp é o canal real) e avisa antecipadamente o que vai acontecer ("Abre o WhatsApp com a sua mensagem já preenchida"), em vez de fingir ser um sistema de reservas.
3. **Degradação limpa de dados opcionais** — specs, equipamento e dados estruturados (schema.org `Offer` com `availability` mapeado corretamente a vendida/brevemente/para venda) desaparecem sem deixar buracos visíveis quando o campo não existe — excePto o preço, ver P1 abaixo.

## Priority Issues

**[P0] A posição de scroll não é reposta ao navegar do stock para o detalhe do veículo**
- **Porque importa:** Confirmado ao vivo em 375px: depois de percorrer `/stock`, tocar em "Ver detalhes" aterra na nova página já deslocada para o ponto de scroll anterior — no teste, direto ao parágrafo "Descrição", saltando a foto, o nome, a etiqueta de estado e o preço. É a página de maior risco do site, e a primeira coisa que muitos visitantes veem é texto solto em vez de prova do veículo. Confirmado no código: nenhuma rota pública repõe o scroll (só o `AdminPage.tsx` o faz, para outro fluxo).
- **Correção:** repor o scroll ao topo na mudança de rota (efeito ligado à rota em `App.tsx`, ou um wrapper de reposição de scroll a nível de rota).
- **Comando sugerido:** `/impeccable harden`

**[P1] Sem texto alternativo quando a autocaravana não tem preço**
- **Porque importa:** Confirmado ao vivo na "Ford Laika" — a linha do preço desaparece por completo, deixando "Ford Laika / 2007 | 100000 km" sem explicação. Numa página cujo trabalho é ajudar um estranho a decidir se vale a pena visitar, omitir silenciosamente o número mais decisivo lê-se como avaria, não como "preço sob consulta".
- **Correção:** mostrar um texto honesto ("Preço sob consulta") sempre que `vehicle.price` estiver vazio, em vez de remover o elemento.
- **Comando sugerido:** `/impeccable clarify`

**[P1] Texto de estado vazio/placeholder viola a própria regra de contraste do sistema — confirmado por dois métodos independentes**
- **Porque importa:** `VehicleDetailPage.tsx` linha 232 mostra "Fotos brevemente disponíveis" a `text-black/30` sobre `bg-[#e6e6e3]`. A "Regra do Piso de Contraste" do próprio `DESIGN.md` proíbe texto legível abaixo de `black/60`/`white/60` — e documenta que `black/40` já mediu 2.85:1 antes de ser corrigido. `black/30` é ainda mais escuro. Os placeholders do formulário (`black/45`/`white/50`, linhas 309–321) repetem a mesma violação duas vezes mais. Independentemente, o detector ao vivo confirmou outra instância real de baixo contraste no botão de fallback do WhatsApp em `ShareButtons.tsx` (2.0:1). Dois métodos, dois ficheiros, o mesmo problema de fundo.
- **Correção:** subir estes valores para `/60` no mínimo, seguindo a própria regra do sistema.
- **Comando sugerido:** `/impeccable harden`

**[P1] Sem forma de aproximar ou inspecionar de perto as fotos do veículo**
- **Porque importa:** confirmado ao clicar na foto principal — nada acontece; sem lightbox, sem zoom, sem vista em tamanho real. Segundo o `PRODUCT.md`, fotos reais e honestas são o sinal de confiança pré-visita mais importante numa compra de veículo usado; limitá-las a uma caixa pequena de proporção fixa mina precisamente aquilo que o negócio diz fazer melhor do que um stand grande.
- **Correção:** adicionar clique-para-expandir/lightbox na foto principal (desktop no mínimo; pinch/duplo-toque no mobile).
- **Comando sugerido:** `/impeccable polish`

**[P2] No mobile, a única ação de conversão fica no fundo da página, sem alternativa persistente**
- **Porque importa:** `lg:sticky` só ativa a partir do breakpoint `lg` — confirmado ao vivo em 375px que "Tem interesse?" é um bloco normal depois de fotos, descrição, specs, equipamento e botões de partilha, ou seja, o último conteúdo antes do rodapé. Combinado com o bug de scroll (P0), um visitante que aterre a meio da página pode nunca perceber que o cartão de contacto existe sem percorrer deliberadamente até ao fim.
- **Correção:** adicionar uma barra de CTA fixa/flutuante leve no mobile para que a ação de conversão continue alcançável independentemente da posição de scroll.
- **Comando sugerido:** `/impeccable layout`

**[P2] Parágrafo de descrição sem limite de largura de linha — achado do detector, não visto pela revisão manual**
- **Porque importa:** o detector mediu ~104 carateres/linha no parágrafo de descrição em largura desktop (`whitespace-pre-line`, sem `max-width`/`ch`, dentro de uma coluna `lg:col-span-2` larga). Texto corrido acima de ~80 carateres/linha cansa a leitura — precisamente o tipo de detalhe que um scan automático apanha e uma leitura visual rápida pode passar ao lado.
- **Correção:** limitar a largura do parágrafo de descrição (ex: `max-w-[65ch]` ou equivalente) dentro da coluna existente.
- **Comando sugerido:** `/impeccable layout`

## Persona Red Flags

**Jordan (Principiante Confuso):** Vê "Ford Laika" sem preço e não sabe se a página está avariada ou se o dado simplesmente falta. Toca na foto principal esperando que amplie (nada sinaliza o contrário) e não acontece nada. Lê "Fotos brevemente disponíveis" a um contraste quase invisível e pode nem registar que o texto existe. Se abrir uma página de detalhe a partir de um `/stock` já deslocado (provável no mobile, onde os filtros empurram a grelha para baixo), aterra em "Descrição" sem ideia de qual autocaravana, que preço, ou como é, até percorrer manualmente para cima.

**Riley (Testador Metódico):** Submete o formulário de contacto com o campo "contacto" em texto disparatado ("asdf") — não há validação de formato nenhuma, por isso o formulário abre o WhatsApp a dizer ao negócio "O meu contacto: asdf", um lead que nunca poderão seguir. Nota que o ritmo vertical do cabeçalho difere entre um veículo com preço (Fiat) e um sem (Ford Laika) — sinal de que o layout nunca foi testado contra o seu próprio modelo de dados opcional. Se atualizar a página a meio do formulário, perde tudo o que escreveu em Nome/Contacto, sem recuperação de rascunho.

**Casey (Utilizadora Móvel Distraída):** Percorre fotos, descrição e specs com uma mão, e só alcança a única ação de conversão ("Tem interesse?") depois de passar por tudo o resto — nenhum CTA persistente fica na zona do polegar enquanto navega. Se for interrompida e voltar por um toque a partir de um stock já deslocado, o bug de scroll (P0) pode deixá-la a meio da página em vez de no topo, agravando o "onde estou". Os círculos anterior/seguinte da galeria (~40px) ficam ligeiramente abaixo do alvo de toque confortável de 44×44pt.

## Minor Observations

- Preço sem separador de milhares nem espaço antes do símbolo ("35000€" em vez de "35 000 €") — pequeno mas visível no número mais importante da página.
- Hierarquia de cabeçalhos salta um nível: o nome do veículo é o único `h1`, e todas as secções ("Descrição", "Especificações", "Equipamento", "Tem interesse?") são `h3` — não existe `h2` nenhum na página (confirmado independentemente pela revisão manual e pelo detector automático).
- O campo "contacto" pede email OU telefone no mesmo campo, sem validação específica de nenhum dos dois formatos.
- A navegação da galeria funciona por rato/toque e é focável/ativável por Enter, mas não responde a ArrowLeft/ArrowRight, o que visualmente se apresenta como um carrossel.
- O fallback de partilha sem Web Share API oferece só WhatsApp + copiar link — escolha estreita mas coerente com a marca; sem alternativa de email/SMS em desktop sem a API nativa.

## Questions to Consider

- Esta página lê-se como um template de classificados preenchido com dados — o que mudaria se a única coisa que diferencia este negócio ("preparada como se fosse da família", sem pressão) realmente aparecesse aqui, onde a decisão de confiança acontece, e não só na home?
- Se a foto é a coisa mais próxima de uma inspeção presencial antes de decidir ir à Covilhã, porque é tratada como uma caixa pequena e não-ampliável como em qualquer site de classificados — o que mudaria se a foto fosse tratada como o produto?
- O texto do estado "vendida" ("Mais um cliente satisfeito") é mais caloroso e pessoal do que o estado "para venda" por defeito — o que seria preciso para trazer essa mesma voz para o momento principal de compra, não só para o momento de consolação?
