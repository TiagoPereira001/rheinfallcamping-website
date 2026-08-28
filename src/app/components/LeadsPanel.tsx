import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Check, Clock } from "lucide-react";
import { db } from "../lib/firebase";
import type { Lead } from "../hooks/useLeads";

function dataLegivel(l: Lead) {
  if (!l.criadoEm?.seconds) return "";
  return new Date(l.criadoEm.seconds * 1000).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type Props = {
  leads: Lead[];
  aCarregar: boolean;
  erro: string;
  recarregar: () => void;
};

function LeadsPanel({ leads, aCarregar, erro, recarregar }: Props) {
  const alternarTratado = async (l: Lead) => {
    await updateDoc(doc(db, "leads", l.id), { tratado: !l.tratado });
    recarregar();
  };

  const apagar = async (l: Lead) => {
    if (!confirm(`Apagar o pedido de ${l.nome || "sem nome"}?`)) return;
    await deleteDoc(doc(db, "leads", l.id));
    recarregar();
  };

  const porTratar = leads.filter((l) => !l.tratado).length;

  if (aCarregar) return <p className="text-black/50 text-sm">A carregar pedidos...</p>;
  if (erro) return <p className="text-red-700 text-sm">{erro}</p>;

  if (leads.length === 0) {
    return <p className="text-black/50 text-sm">Ainda não há pedidos de venda.</p>;
  }

  return (
    <div>
      <p className="text-black/50 text-sm mb-4">
        {leads.length} {leads.length === 1 ? "pedido" : "pedidos"}
        {porTratar > 0 && ` · ${porTratar} por tratar`}
      </p>

      <div className="space-y-3">
        {leads.map((l) => (
          <div
            key={l.id}
            className={`bg-white rounded-xl border p-5 ${
              l.tratado ? "border-black/5 opacity-60" : "border-black/15"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <span className="block text-black font-medium">
                  {l.nome || "Sem nome"}
                </span>
                <span className="block text-black/60 text-sm">{l.contacto}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => alternarTratado(l)}
                  aria-label={l.tratado ? "Marcar por tratar" : "Marcar como tratado"}
                  className={`p-2 border rounded-lg transition-colors ${
                    l.tratado
                      ? "border-black/15 text-black/40 hover:bg-black/5"
                      : "border-[#2f7d4f]/30 text-[#2f7d4f] hover:bg-[#2f7d4f]/5"
                  }`}
                >
                  {l.tratado ? <Clock size={15} /> : <Check size={15} />}
                </button>
                <button
                  onClick={() => apagar(l)}
                  aria-label="Apagar pedido"
                  className="p-2 border border-black/15 rounded-lg hover:bg-red-50 hover:border-red-200 text-red-700 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="text-sm text-black/70 space-y-1">
              {l.marca && <p><strong className="font-medium text-black">Autocaravana:</strong> {l.marca}</p>}
              {(l.ano || l.km || l.preco) && (
                <p>{[l.ano, l.km, l.preco].filter(Boolean).join(" · ")}</p>
              )}
              {l.notas && <p className="whitespace-pre-line pt-1">{l.notas}</p>}
            </div>

            <span className="block text-black/35 text-xs mt-3">{dataLegivel(l)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeadsPanel;