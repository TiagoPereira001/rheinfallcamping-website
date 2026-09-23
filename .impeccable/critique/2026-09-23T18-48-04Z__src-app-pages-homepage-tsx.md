---
target: Home
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/Users/tiagopereiradias/Desktop/site pai/src/app/pages/HomePage.tsx"
target_fingerprint: "sha256:b33b73e982495d30e80a9a4360d6822457e1636db70af2e8d88ece9643ddcd45"
target_path: /Users/tiagopereiradias/Desktop/site pai/src/app/pages/HomePage.tsx
timestamp: 2026-09-23T18-48-04Z
slug: src-app-pages-homepage-tsx
---
Method: dual-agent (A: Design Review sub-agent · B: Detector/Browser Evidence sub-agent, isolated, parallel)

# Critique — HomePage (`src/app/pages/HomePage.tsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Stock loading/error states exist; no skeleton for card images |
| 2 | Match System / Real World | 4 | Tom e linguagem em português batem certo com o público local |
| 3 | User Control and Freedom | 3 | Menu hambúrguer mobile não fecha ao fazer scroll — sobrepõe o conteúdo |
| 4 | Consistency and Standards | 2 | WhatsApp é o "canal principal" em todo o produto, mas não existe na home |
| 5 | Error Prevention | 3 | Sem formulários nesta página; único erro (stock) tratado adequadamente |
| 6 | Recognition Rather Than Recall | 4 | Nav literal, sem estado escondido para memorizar |
| 7 | Flexibility and Efficiency | n/a | Página persuade-mode simples, sem atalhos de utilizador recorrente aplicáveis |
| 8 | Aesthetic and Minimalist Design | 3 | Bloco de cor limpo, mas grelha 2-de-3 desequilibrada + placeholder cinzento |
| 9 | Error Recovery | 3 | Único estado de erro presente é claro |
| 10 | Help and Documentation | n/a | Não aplicável a uma landing page |
| **Total** | | **25/32** | **Good (78%)** |

## Design Specificity Verdict

**Avaliação (A):** Maioritariamente autoral, não genérico — o texto ("Isto começou com um gosto pessoal...", "Não somos um stand grande e não queremos ser"), a foto real da autocaravana no herói, e a disciplina do acento serif único (Playfair só nos nomes dos veículos) provam que isto foi pensado para este negócio específico. Duas coisas furam essa ilusão: a secção "Quem somos" — o momento mais importante para provar "O Quintal da Família" — mostra uma caixa cinzenta "Foto em breve" em vez de prova real; e não existe nenhum botão de WhatsApp na página, apesar de ser o canal de contacto principal declarado em PRODUCT.md.

**Scan determinístico (B):** Scan estático do ficheiro HomePage.tsx isolado → 0 findings (limpo). Scan ao vivo da página renderizada (via overlay do detector) → 3 sinais: `overused-font` (Inter em 95% do texto) e `image-hover-transform` ×2 (hover com scale num `<img>`). Ambos são provavelmente falsos positivos face ao próprio DESIGN.md: Inter dominante é a regra documentada do "Acento Único", e o zoom no hover da foto do cartão é o "único movimento tátil do sistema hoje" — explicitamente documentado em DESIGN.md. Nenhum dos três sinais se origina em HomePage.tsx propriamente — vêm de VehicleCard/Header.

**Evidência visual:** Sem imagens rotas, sem erros de consola, sem overflow em desktop ou mobile (375×812).

## Overall Impression

A cópia e a fotografia são genuinamente específicas desta família. Mas a página trai a própria promessa em dois pontos: promete "falamos diretamente, sem pressão" sem dar nenhuma forma de começar essa conversa (zero WhatsApp), e o momento emocional mais importante da página ("Quem somos") termina numa caixa "Foto em breve" em vez de prova real.

## What's Working

1. Disciplina tipográfica: Playfair Display reservado só aos nomes dos veículos; todos os títulos da própria home ficam em Inter.
2. Piso de contraste respeitado em toda a página: white/70, white/75, black/60 — nada abaixo do /60 documentado.
3. Ritmo de cor por blocos sólidos (herói preto → secção de stock clara → "Quem somos" escuro) cria capítulos visuais distintos sem gradientes.

## Priority Issues

**[P0] Não existe nenhum CTA de WhatsApp na home**
- Why it matters: PRODUCT.md declara o WhatsApp como "canal de contacto principal"; DESIGN.md tem um componente button-whatsapp dedicado. Confirmado via árvore de acessibilidade: o único contacto na página inteira é um tel: no cabeçalho. Das ligações da página, 4 apontam para /stock e nenhuma para uma conversa direta.
- Fix: acrescentar um botão WhatsApp (#25D366, ícone MessageCircle) no cabeçalho e/ou como CTA secundário junto de "Ver autocaravanas disponíveis" no herói.
- Suggested command: /impeccable clarify ou /impeccable layout

**[P1] Placeholder "Foto em breve" mina o núcleo emocional da página**
- Why it matters: SOBRE_NOS_IMAGE é null, renderizando uma caixa #2a2a2a lisa com "Foto em breve", ao lado da narrativa do fundador. Confirmado de forma independente por ambas as avaliações.
- Fix: obter uma foto real antes de publicar, ou desenhar um estado intencional sem foto em vez do texto literal "coming soon".
- Suggested command: /impeccable delight

**[P1] Grelha "Em destaque" degrada-se mal com contagens não-múltiplas-de-3 e sem estado vazio**
- Why it matters: o site ao vivo mostra atualmente só 2 veículos numa grelha de 3 colunas, deixando um vazio visível; se vehicles estiver vazio, não há mensagem nenhuma.
- Fix: não forçar 3 colunas quando há menos itens preenchidos, e acrescentar mensagem explícita para o caso vazio.
- Suggested command: /impeccable layout

**[P2] Cabeçalho junta 5 alvos de peso igual, violando a diretriz de agrupamento ≤4**
- Why it matters: Início, Stock, "Quer vender a sua autocaravana?", Contactos e o telefone competem pela mesma atenção, diluindo as duas ações que importam.
- Fix: agrupar ou reduzir peso visual dos itens secundários.
- Suggested command: /impeccable layout

**[P2] Menu hambúrguer mobile não fecha ao scroll — sobreposição visível confirmada em teste**
- Why it matters: bug de interação real — deixa a navegação sobreposta ao conteúdo quando o utilizador rola com o menu aberto.
- Fix: fechar o menu mobile automaticamente num evento de scroll ou ao clicar fora.
- Suggested command: /impeccable adapt

## Persona Red Flags

**Jordan (Primeira visita)**: o texto tranquiliza, mas o único próximo passo oferecido é navegar o stock — não há forma de baixo compromisso para "só perguntar algo".

**Riley (Testador metódico)**: encontra de imediato o desequilíbrio da grelha 2-de-3, a ausência de mensagem para stock vazio, o placeholder "Foto em breve", e o bug do menu mobile.

**Casey (Mobile, distraída)**: layout e alvos de toque estão bem tratados — mas Casey é exatamente a persona mais propensa a preferir WhatsApp a uma chamada, e essa opção não existe nesta página.

## Minor Observations

- "Em destaque" sugere curadoria editorial, mas o código é só vehicles.slice(0, 3) sem lógica de seleção visível.
- A secção "Quem somos" (#1a1a1a) encontra o rodapé preto (#000000) sem nenhuma borda ou espaço separador.
- O CTA rounded-full do herói corresponde corretamente à única exceção documentada ao padrão rounded-xl de botões no DESIGN.md.
- Os dois sinais do detector ao vivo (overused-font, image-hover-transform) são, com grande confiança, falsos positivos face às regras já documentadas em DESIGN.md.

## Questions to Consider

1. Se o WhatsApp é o canal de contacto principal declarado em todo o resto do produto, porque está totalmente ausente da página que mais gente vê primeiro?
2. "Em destaque" implica curadoria editorial — existe um critério real de seleção, ou serão sempre só os três primeiros veículos a carregar?
3. A secção "Quem somos" é a ferramenta mais forte deste site para se diferenciar de um "stand grande" — há uma data prevista para a foto real?
