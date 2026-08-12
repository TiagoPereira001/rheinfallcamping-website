import { useState } from "react";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { whatsappLink, LOCATION, WHATSAPP_NUMBER } from "../data/config";
import { usePageTitle } from "../hooks/usePageTitle";

const phoneDisplay = WHATSAPP_NUMBER.replace("351", "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

function ContactosPage() {
  usePageTitle(
    "Contactos",
    "Fale connosco para marcar uma visita. Autocaravanas usadas na zona da Covilhã, com atendimento direto."
  );

  const [form, setForm] = useState({ nome: "", telefone: "", veiculo: "" });
  const [erro, setErro] = useState("");

  const handleChange = (campo: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
    setErro("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome.trim() || !form.telefone.trim()) {
      setErro("Por favor preencha o nome e o telefone.");
      return;
    }

    const linhas = [
      `Olá! Chamo-me ${form.nome.trim()} e gostava de agendar uma visita.`,
      form.veiculo.trim() ? `Autocaravana de interesse: ${form.veiculo.trim()}` : "",
      `O meu contacto: ${form.telefone.trim()}`,
    ].filter(Boolean);

    window.open(whatsappLink(linhas.join("\n")), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/40 focus:ring-1 ring-black/20 transition-all";

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">

        <div className="mb-14 max-w-2xl">
          <h1 className="text-black text-3xl md:text-4xl font-medium mb-4">
            Venha ver as autocaravanas
          </h1>
          <p className="text-black/70 text-[0.9375rem] leading-relaxed">
            As visitas são feitas por marcação, para termos tempo de lhe mostrar tudo com calma
            e responder a todas as perguntas. Ligue ou deixe o contacto — respondemos no próprio dia.
          </p>
        </div>

        {/* Contactos diretos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="bg-white rounded-2xl border border-black/5 p-6 hover:border-black/20 transition-colors group"
          >
            <Phone size={18} className="text-black/40 mb-3" />
            <span className="block text-xs uppercase tracking-wider text-black/40 mb-1.5">
              Telefone
            </span>
            <span className="block text-black font-medium group-hover:underline underline-offset-4">
              {phoneDisplay}
            </span>
          </a>

          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <MapPin size={18} className="text-black/40 mb-3" />
            <span className="block text-xs uppercase tracking-wider text-black/40 mb-1.5">
              Onde estamos
            </span>
            <span className="block text-black font-medium">{LOCATION}</span>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <Clock size={18} className="text-black/40 mb-3" />
            <span className="block text-xs uppercase tracking-wider text-black/40 mb-1.5">
              Visitas
            </span>
            <span className="block text-black font-medium">Por marcação</span>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl border border-black/5 p-8 md:p-10">
          <div className="max-w-lg">
            <h2 className="text-black text-xl font-medium mb-2">
              Deixe o seu contacto
            </h2>
            <p className="text-black/60 text-sm mb-8">
              Preencha e enviamos-lhe uma mensagem para combinar o melhor dia.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-black text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange("nome")}
                  placeholder="O seu nome"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-black text-sm font-medium mb-2">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={handleChange("telefone")}
                  placeholder="O seu número"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="veiculo" className="block text-black text-sm font-medium mb-2">
                  Qual a autocaravana que lhe interessa? <span className="text-black/40 font-normal">(opcional)</span>
                </label>
                <input
                  id="veiculo"
                  type="text"
                  value={form.veiculo}
                  onChange={handleChange("veiculo")}
                  placeholder="Ex: Fiat Dethleffs"
                  className={inputClass}
                />
              </div>

              {erro && <p className="text-red-700 text-sm">{erro}</p>}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-black/85 transition-colors"
                >
                  Marcar visita
                </button>
                <a
                  href={whatsappLink("Olá, tenho interesse nas vossas autocaravanas.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
              </div>

              <p className="text-black/45 text-xs pt-1">
                Ao enviar, abre o WhatsApp com a mensagem já escrita.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactosPage;