import { Link } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { useConsentimento } from "../hooks/useConsentimento";
import { WHATSAPP_NUMBER, LOCATION } from "../data/config";

const phoneDisplay = WHATSAPP_NUMBER.replace("351", "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

function PrivacidadePage() {
  usePageTitle(
    "Privacidade e cookies",
    "Como tratamos os seus dados e que cookies usamos no site da RheinfallCamping."
  );

  const { estado, decidir } = useConsentimento();

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-10">

        <h1 className="text-black text-3xl md:text-4xl font-medium mb-4">
          Privacidade e cookies
        </h1>
        <p className="text-black/50 text-sm mb-12">
          Última atualização: {new Date().toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-10 text-black/80 text-[0.9375rem] leading-relaxed">

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Quem somos</h2>
            <p>
              A RheinfallCamping é um negócio familiar de compra e venda de autocaravanas
              usadas, com atividade na zona da {LOCATION}. Este site é gerido por nós e
              não partilhamos os seus dados com terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Que dados recolhemos</h2>
            <p className="mb-4">
              Só recolhemos dados que nos dá voluntariamente, através dos formulários do site:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong className="font-medium text-black">Formulário de venda</strong> — nome,
                contacto e os dados da autocaravana que nos quer vender. Usamos esta informação
                apenas para lhe responder.
              </li>
              <li>
                <strong className="font-medium text-black">Formulários de contacto</strong> — os
                dados que escreve são usados para criar uma mensagem de WhatsApp que só é
                enviada se carregar em enviar. Não ficam guardados no site.
              </li>
            </ul>
            <p className="mt-4">
              Não pedimos nem guardamos dados de pagamento, moradas ou documentos de identificação.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Cookies</h2>
            <p className="mb-4">
              Este site usa apenas cookies de análise, através do Google Analytics, para
              percebermos quantas pessoas visitam o site e que páginas são mais vistas.
              Não usamos cookies de publicidade nem de perfilagem.
            </p>
            <p className="mb-4">
              Estes cookies <strong className="font-medium text-black">só são ativados se
              der o seu consentimento</strong>. Se recusar, o site funciona exatamente da
              mesma forma e não recolhemos qualquer dado de navegação.
            </p>

            <div className="bg-white rounded-xl border border-black/10 p-5 mt-6">
              <p className="text-sm mb-4">
                A sua escolha atual:{" "}
                <strong className="font-medium text-black">
                  {estado === "aceite"
                    ? "cookies de análise aceites"
                    : estado === "recusado"
                    ? "cookies de análise recusados"
                    : "ainda não escolheu"}
                </strong>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => decidir("recusado")}
                  className="border border-black/25 text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black/5 transition-colors"
                >
                  Recusar
                </button>
                <button
                  onClick={() => decidir("aceite")}
                  className="border border-black/25 bg-black/5 text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-black/10 transition-colors"
                >
                  Aceitar
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Onde ficam guardados</h2>
            <p>
              Os pedidos de venda ficam guardados no Firestore, um serviço da Google, em
              servidores na União Europeia. O acesso é limitado a nós, com autenticação.
              As fotos das autocaravanas estão alojadas na Cloudinary.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Durante quanto tempo</h2>
            <p>
              Guardamos os pedidos de venda enquanto forem úteis para lhe responder e
              acompanhar o processo. Pode pedir-nos a eliminação a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Os seus direitos</h2>
            <p className="mb-4">
              Nos termos do RGPD, tem direito a saber que dados temos sobre si, a corrigi-los,
              a pedir que sejam apagados, e a opor-se ao seu tratamento. Para exercer qualquer
              destes direitos, basta contactar-nos.
            </p>
            <p>
              Se considerar que os seus dados não estão a ser tratados corretamente, pode
              apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).
            </p>
          </section>

          <section>
            <h2 className="text-black text-xl font-medium mb-3">Contacto</h2>
            <p>
              Para qualquer questão sobre privacidade, contacte-nos pelo telefone{" "}
              <strong className="font-medium text-black">{phoneDisplay}</strong> ou através
              da{" "}
              <Link to="/contactos" className="text-black underline underline-offset-2">
                página de contactos
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PrivacidadePage;