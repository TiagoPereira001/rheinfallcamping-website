import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { api } from "../lib/functions";
import { usePageTitle } from "../hooks/usePageTitle";
import { whatsappLink } from "../data/config";

const campoVazio = {
  nome: "",
  contacto: "",
  marca: "",
  ano: "",
  km: "",
  preco: "",
  notas: "",
  website: "",
};

function VenderPage() {
  usePageTitle(
    "Vender a sua autocaravana",
    "Tem uma autocaravana para vender? Compramos diretamente, com avaliação honesta e pagamento rápido. Zona da Covilhã."
  );

  const [form, setForm] = useState(campoVazio);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [aEnviar, setAEnviar] = useState(false);

  const handleChange =
    (campo: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [campo]: e.target.value }));
      setErro("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.contacto.trim() || !form.marca.trim()) {
      setErro("Preencha pelo menos o nome, o contacto e a marca/modelo.");
      return;
    }

    setAEnviar(true);
    try {
      await api.submitLead({
        nome: form.nome.trim(),
        contacto: form.contacto.trim(),
        marca: form.marca.trim(),
        ano: form.ano.trim(),
        km: form.km.trim(),
        preco: form.preco.trim(),
        notas: form.notas.trim(),
        website: form.website,
      });
      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar. Tente novamente ou contacte-nos por telefone.");
    } finally {
      setAEnviar(false);
    }
  };

  const abrirWhatsApp = () => {
    window.open(
      whatsappLink("Olá, acabei de submeter os dados da minha autocaravana no site."),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const inputClass =
    "w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/40 focus:ring-1 ring-black/20 transition-all";

  if (enviado) {
    return (
      <div className="bg-[#f4f4f2] min-h-screen py-24">
        <div className="max-w-xl mx-auto px-6 text-center">
          <CheckCircle2 size={44} className="text-[#2f7d4f] mx-auto mb-6" />
          <h1 className="text-black text-2xl md:text-3xl font-medium mb-4">
            Recebemos os seus dados
          </h1>
          <p className="text-black/70 text-[0.9375rem] leading-relaxed mb-8">
            Vamos analisar a informação da sua autocaravana e entramos em contacto
            nos próximos dias. Se preferir falar já connosco, use o WhatsApp.
          </p>
          <button
            onClick={abrirWhatsApp}
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-[0.9375rem] font-medium px-7 py-3.5 rounded-xl hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={17} />
            Falar por WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">

        <div className="mb-14 max-w-2xl">
          <h1 className="text-black text-3xl md:text-4xl font-medium mb-4">
            Tem uma autocaravana para vender?
          </h1>
          <p className="text-black/70 text-[0.9375rem] leading-relaxed">
            Compramos autocaravanas usadas, em qualquer estado. Diga-nos o que tem e damos-lhe
            uma resposta honesta — mesmo que seja para dizer que não é para nós.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { n: "1", t: "Envia os dados", d: "Preencha o formulário com o que sabe sobre a autocaravana." },
            { n: "2", t: "Falamos consigo", d: "Ligamos para esclarecer detalhes e combinar ver o veículo." },
            { n: "3", t: "Proposta", d: "Se houver acordo, tratamos da papelada e da transferência." },
          ].map((passo) => (
            <div key={passo.n} className="bg-white rounded-2xl border border-black/5 p-6">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-medium mb-3">
                {passo.n}
              </span>
              <span className="block text-black font-medium mb-1.5">{passo.t}</span>
              <span className="block text-black/60 text-sm leading-relaxed">{passo.d}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 md:p-10">
          <div className="max-w-lg">
            <h2 className="text-black text-xl font-medium mb-2">Dados da autocaravana</h2>
            <p className="text-black/60 text-sm mb-8">
              Quanto mais souber, melhor a avaliação. Mas não faz mal se não souber tudo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="absolute -left-[10000px]" aria-hidden="true">
                <label htmlFor="website">Não preencher</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange("website")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="nome" className="block text-black text-sm font-medium mb-2">
                    Nome
                  </label>
                  <input id="nome" name="nome" type="text" value={form.nome}
                    onChange={handleChange("nome")} placeholder="O seu nome" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contacto" className="block text-black text-sm font-medium mb-2">
                    Contacto
                  </label>
                  <input id="contacto" name="contacto" type="text" value={form.contacto}
                    onChange={handleChange("contacto")} placeholder="Telefone ou email" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="marca" className="block text-black text-sm font-medium mb-2">
                  Marca e modelo
                </label>
                <input id="marca" name="marca" type="text" value={form.marca}
                  onChange={handleChange("marca")} placeholder="Ex: Fiat Ducato Rapido" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="ano" className="block text-black text-sm font-medium mb-2">
                    Ano <span className="text-black/40 font-normal">(opcional)</span>
                  </label>
                  <input id="ano" name="ano" type="text" value={form.ano}
                    onChange={handleChange("ano")} placeholder="2005" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="km" className="block text-black text-sm font-medium mb-2">
                    Km <span className="text-black/40 font-normal">(opcional)</span>
                  </label>
                  <input id="km" name="km" type="text" value={form.km}
                    onChange={handleChange("km")} placeholder="78.000" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="preco" className="block text-black text-sm font-medium mb-2">
                    Preço <span className="text-black/40 font-normal">(opcional)</span>
                  </label>
                  <input id="preco" name="preco" type="text" value={form.preco}
                    onChange={handleChange("preco")} placeholder="€ 25.000" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="notas" className="block text-black text-sm font-medium mb-2">
                  Estado e observações <span className="text-black/40 font-normal">(opcional)</span>
                </label>
                <textarea id="notas" name="notas" value={form.notas} onChange={handleChange("notas")}
                  rows={4} placeholder="Estado geral, o que já foi feito, o que precisa de arranjo..."
                  className={inputClass + " resize-none"} />
              </div>

              {erro && <p className="text-red-700 text-sm">{erro}</p>}

              <button
                type="submit"
                disabled={aEnviar}
                className="w-full sm:w-auto bg-black text-white text-[0.9375rem] font-medium px-8 py-3.5 rounded-xl hover:bg-black/85 transition-colors disabled:opacity-50"
              >
                {aEnviar ? "A enviar..." : "Enviar dados"}
              </button>

              <p className="text-black/45 text-xs pt-1">
                Só usamos estes dados para lhe responder. Não são partilhados com ninguém.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VenderPage;
