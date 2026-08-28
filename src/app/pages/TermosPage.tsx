import { Link } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { LOCATION } from "../data/config";

function TermosPage() {
  usePageTitle(
    "Termos e condições",
    "Condições de utilização do site da RheinfallCamping."
  );

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-10">

        <h1 className="text-black text-3xl md:text-4xl font-medium mb-4">
          Termos e condições
        </h1>
        <p className="text-black/50 text-sm mb-12">
          Última atualização: {new Date().toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-10 text-black/80 text-[0.9375rem] leading-relaxed">

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Sobre este site</h2>
            <p>
              Este site é um espaço de divulgação das autocaravanas que temos disponíveis
              na zona da {LOCATION}. Não é uma loja online: não é possível comprar nem
              reservar através do site, e nenhum pagamento é feito aqui.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Informação dos anúncios</h2>
            <p className="mb-4">
              Esforçamo-nos por manter a informação de cada autocaravana correta e atualizada.
              Ainda assim, podem existir erros ou desatualizações, sobretudo em quilometragens,
              equipamento e disponibilidade.
            </p>
            <p>
              As fotografias são das autocaravanas reais, mas as cores podem variar consoante
              o ecrã. Nenhuma informação do site substitui a visita ao veículo — recomendamos
              sempre que veja a autocaravana pessoalmente antes de decidir.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Preços e disponibilidade</h2>
            <p>
              Os preços indicados são de referência e podem ser alterados sem aviso prévio.
              Uma autocaravana estar no site não garante que continua disponível — o stock
              muda com frequência e podemos não conseguir atualizar de imediato.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Visitas e contactos</h2>
            <p>
              As visitas são feitas por marcação prévia. O envio de um formulário ou mensagem
              não constitui reserva nem compromisso de compra ou venda por nenhuma das partes.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Garantia e direitos do consumidor</h2>
            <p className="mb-4">
              A venda de veículos usados está sujeita à legislação portuguesa de defesa do
              consumidor, incluindo o regime de garantia legal aplicável a bens em segunda mão.
              Os seus direitos legais não são afetados por nada que esteja escrito neste site.
            </p>
            <p>
              As condições concretas de cada negócio — garantia, prazos e o que está incluído —
              são acordadas por escrito no momento da venda.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Conteúdo do site</h2>
            <p>
              As fotografias e textos deste site são nossos. Pode partilhar links à vontade,
              mas não reutilize as fotografias em anúncios de terceiros sem falar connosco.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Resolução de litígios</h2>
            <p>
              Em caso de litígio de consumo, pode recorrer a uma entidade de resolução
              alternativa de litígios. Pode consultar a lista de entidades disponíveis no
              Portal do Consumidor, em consumidor.gov.pt.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Privacidade</h2>
            <p>
              O tratamento dos seus dados está descrito na{" "}
              <Link to="/privacidade" className="text-black underline underline-offset-2">
                página de privacidade e cookies
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default TermosPage;