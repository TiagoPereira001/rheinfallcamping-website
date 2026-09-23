# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Compradores** — pessoas à procura de uma autocaravana usada na zona da Covilhã. Navegam o stock (`/stock`), veem detalhes de um veículo (`/stock/:id`) e contactam por WhatsApp ou pelo formulário de contacto para marcar uma visita presencial.
- **Vendedores** — pessoas com uma autocaravana para vender, que submetem os dados através de `/vender`.
- **Administrador** — o pai do utilizador (Tiago), único gestor do stock e dos pedidos de venda, através de `/admin` (login com Firebase Auth, custom claim `admin: true`). Não é tecnicamente sofisticado — qualquer funcionalidade nova do admin tem de continuar simples de usar sem ajuda.

Confirmado: não há mais utilizadores administrativos além do pai.

## Product Purpose

Mostrar as autocaravanas usadas disponíveis (compra e venda), de forma honesta e com fotos reais, e gerar contacto direto — por WhatsApp ou formulário — para agendar uma visita presencial. O site não vende nem reserva nada por si: existe para informar e iniciar a conversa. Também dá ao administrador uma forma simples de gerir o stock e os pedidos de venda sem precisar de tocar em código.

## Positioning

Negócio familiar de compra e venda de autocaravanas, com mais de 10 anos de experiência na zona da Covilhã. O que os distingue de um stand grande:

- atendimento direto, sem pressão de vendas e sem surpresas;
- cada autocaravana é preparada antes de vender como se fosse para uso próprio da família;
- pequenos e locais por escolha — "Não somos um stand grande e não queremos ser."

Confirmado pelo utilizador que este posicionamento já está completo — nada a acrescentar.

## Operating Context

- Visitas são sempre presenciais e por marcação prévia — nunca instantâneas.
- WhatsApp é o canal de contacto principal: os formulários do site (contacto, proposta, venda) abrem o WhatsApp com uma mensagem já escrita, em vez de enviar algo diretamente.
- O catálogo (`vehicles`) é público e lido diretamente do Firestore; todas as escritas (veículos, pedidos de venda, upload de fotos) passam por Cloud Functions com validação e rate limiting — nunca escrita direta do browser.
- Fotos das autocaravanas são alojadas na Cloudinary, com upload assinado (só o admin consegue enviar).
- Site alojado na Cloudflare Pages; publica automaticamente a cada `git push` para `main`.

## Capabilities and Constraints

- **Nunca se torna uma loja online.** Confirmado explicitamente pelo utilizador: sem pagamentos, sem reservas, sem checkout — as visitas continuam sempre presenciais, por marcação. Esta é uma regra de negócio para manter, não apenas o estado atual.
- Não existe registo público de contas — o acesso a `/admin` é criado manualmente na consola do Firebase, um único administrador.
- Site inteiramente em português (nomes de variáveis/funções no código também, ver `CLAUDE.md`).
- Sem pagamentos, sem carrinho, sem gestão de encomendas — fora de âmbito por definição do negócio, não só por ainda não ter sido construído.

## Brand Commitments

- Nome: **RheinfallCamping**. Tagline: "Autocaravanas usadas na Covilhã".
- Tipografia: Playfair Display (títulos/serif) + Inter (texto).
- Cor de destaque da marca: dourado/tostado `#C2A07A`. Cores de estado do stock: verde `#2f7d4f` (para venda), vermelho `#b02020` (vendida).
- Tom de voz: direto, pessoal, sem jargão de vendas — primeira pessoa do plural ("nós"), frases curtas.

## Evidence on Hand

- Fotos reais de cada autocaravana (alojadas na Cloudinary), usadas na galeria de cada veículo.
- Contacto real: telefone e localização (Covilhã) usados em todo o site.
- **Sem testemunhos, casos de estudo ou avaliações de clientes** — nenhum existe atualmente; trabalho futuro não deve inventar nenhum.

## Product Principles

1. **Direto e sem pressão vence volume.** Cada decisão de produto deve ler-se como pessoal, não corporativa — nunca introduzir táticas de urgência, upsell agressivo ou linguagem de "stand grande".
2. **Cada autocaravana é tratada como se fosse para a família.** A honestidade na descrição (estado, equipamento, preço) importa mais do que tornar tudo parecer perfeito.
3. **O site inicia a conversa, nunca a fecha.** Todo o caminho de conversão termina em WhatsApp/contacto — nunca construir pagamento, reserva ou checkout.
4. **Pequenos e locais por escolha.** Crescer em escala não é um objetivo; simplicidade para o administrador (não técnico) vence funcionalidades avançadas.
5. **Confiança presencial acima de transação online.** Fotos e descrições têm de ser honestas porque a visita real é sempre a prova final.

## Accessibility & Inclusion

Nenhum padrão específico foi exigido pelo utilizador. Já foi feita uma revisão de contraste WCAG AA a todo o texto público (ver histórico de engenharia) — trabalho visual futuro deve manter esse nível por defeito.
