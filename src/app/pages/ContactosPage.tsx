import { useState } from "react";
import { whatsappLink, LOCATION } from "../data/config";

function ContactosPage() {
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
    "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/30 focus:ring-1 ring-black/30 transition-all";

  return (
    <div className="bg-black min-h-screen py-16 md:py-24 font-sans text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h1 className="font-serif text-white text-4xl md:text-5xl font-medium mb-8">
              Venha ver as autocaravanas
            </h1>
            <p className="text-white/80 text-[1.0625rem] leading-relaxed mb-12 max-w-md">
              As nossas visitas são feitas{" "}
              <strong className="text-white">exclusivamente por marcação prévia</strong>.
              Desta forma, garantimos que temos a dedicação e o tempo necessários para
              lhe apresentar cada detalhe do veículo com toda a calma e honestidade.
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                  Localização
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">{LOCATION}</p>
              </div>

              <div className="pt-4">
                <a
                  href={whatsappLink("Olá, tenho interesse nas vossas autocaravanas.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white text-[0.9375rem] font-medium px-8 py-4 rounded-xl hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#f4f4f2] rounded-3xl p-8 md:p-12 shadow-xl text-black">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-black text-sm font-medium mb-2">
                  Nome completo
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
                  placeholder="O seu número de contacto"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="veiculo" className="block text-black text-sm font-medium mb-2">
                  Qual a autocaravana que tem interesse?
                </label>
                <input
                  id="veiculo"
                  type="text"
                  value={form.veiculo}
                  onChange={handleChange("veiculo")}
                  placeholder="Ex: Ford Laika"
                  className={inputClass}
                />
              </div>

              {erro && <p className="text-red-700 text-sm">{erro}</p>}

              <button
                type="submit"
                className="w-full bg-black text-white text-[0.9375rem] font-medium py-3.5 rounded-xl hover:bg-black/80 transition-colors mt-4"
              >
                Agendar Visita
              </button>

              <p className="text-black/50 text-xs text-center">
                Ao clicar, abre o WhatsApp com a sua mensagem já preenchida.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactosPage;