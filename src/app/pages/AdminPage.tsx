import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { LogOut, Plus, Pencil, Trash2, X } from "lucide-react";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Vehicle } from "../hooks/useVehicles";
import ImageUploader from "../components/ImageUploader";

const vazio = {
  name: "", year: "", km: "", price: "", status: "",
  registration: "", engine: "", power: "", fuel: "",
  transmission: "", seats: "", beds: "", condition: "", warranty: "",
  description: "", images: "", features: "",
};

// ---------- Ecrã de login ----------
function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [aEntrar, setAEntrar] = useState(false);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setAEntrar(true);
    try {
      await entrar(email, password);
    } catch {
      setErro("Email ou palavra-passe incorretos.");
    } finally {
      setAEntrar(false);
    }
  };

  const input = "w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/40 transition-all";

  return (
    <div className="bg-[#f4f4f2] min-h-screen flex items-center justify-center py-24 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-black text-2xl font-medium mb-2">Área interna</h1>
        <p className="text-black/60 text-sm mb-8">Inicie sessão para gerir o stock.</p>

        <form onSubmit={submeter} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" autoComplete="username" className={input} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Palavra-passe" autoComplete="current-password" className={input} />

          {erro && <p className="text-red-700 text-sm">{erro}</p>}

          <button type="submit" disabled={aEntrar}
            className="w-full bg-black text-white text-sm font-medium py-3.5 rounded-xl hover:bg-black/85 transition-colors disabled:opacity-50">
            {aEntrar ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- Painel de gestão ----------
function Painel() {
  const { utilizador, sair } = useAuth();
  const [lista, setLista] = useState<Vehicle[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [form, setForm] = useState(vazio);
  const [aEditar, setAEditar] = useState<string | null>(null);
  const [aGravar, setAGravar] = useState(false);
  const [msg, setMsg] = useState("");

  const carregar = async () => {
    setACarregar(true);
    const snap = await getDocs(collection(db, "vehicles"));
    setLista(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) })));
    setACarregar(false);
  };

  useEffect(() => { carregar(); }, []);

  const alterar = (campo: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [campo]: e.target.value }));

  const limpar = () => { setForm(vazio); setAEditar(null); };

  const gravar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setMsg("O nome é obrigatório."); return; }

    setAGravar(true);
    setMsg("");
    try {
      const dados: Record<string, unknown> = { ...form };
      dados.images = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
      dados.features = form.features.split("\n").map((s) => s.trim()).filter(Boolean);

      Object.keys(dados).forEach((k) => {
        const v = dados[k];
        if (v === "" || (Array.isArray(v) && v.length === 0)) delete dados[k];
      });

      if (aEditar) {
        await updateDoc(doc(db, "vehicles", aEditar), dados);
        setMsg("Autocaravana atualizada.");
        // Não limpamos: continua a editar a mesma, no mesmo sítio
      } else {
        await addDoc(collection(db, "vehicles"), dados);
        setMsg("Autocaravana adicionada.");
        limpar();
      }
      await carregar();
    } catch (err) {
      console.error(err);
      setMsg("Não foi possível gravar. Verifique a ligação.");
    } finally {
      setAGravar(false);
    }
  };

  const editar = (v: Vehicle) => {
    setForm({
      name: v.name ?? "", year: v.year ?? "", km: v.km ?? "", price: v.price ?? "",
      status: v.status ?? "", registration: v.registration ?? "", engine: v.engine ?? "",
      power: v.power ?? "", fuel: v.fuel ?? "", transmission: v.transmission ?? "",
      seats: v.seats ?? "", beds: v.beds ?? "", condition: v.condition ?? "",
      warranty: v.warranty ?? "", description: v.description ?? "",
      images: (v.images ?? []).join("\n"),
      features: (v.features ?? []).join("\n"),
    });
    setAEditar(v.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const apagar = async (v: Vehicle) => {
    if (!confirm(`Apagar "${v.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteDoc(doc(db, "vehicles", v.id));
      setMsg("Autocaravana removida.");
      await carregar();
    } catch {
      setMsg("Não foi possível remover.");
    }
  };

  const input = "w-full bg-[#f4f4f2] border border-black/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black/40 transition-all";
  const label = "block text-black/70 text-xs font-medium mb-1.5";

  const campos: [string, string, string][] = [
    ["name", "Nome (marca + modelo)", "Ex: Fiat Dethleffs Trend"],
    ["price", "Preço", "€ 35.000"],
    ["year", "Ano", "2005"],
    ["km", "Quilómetros", "78.000 km"],
    ["registration", "Livrete", "2016/03"],
    ["engine", "Motor", "2.8 JTD"],
    ["power", "Potência", "155 cv"],
    ["fuel", "Combustível", "Diesel"],
    ["transmission", "Transmissão", "Manual"],
    ["seats", "Lugares", "5 lugares"],
    ["beds", "Camas", "2 camas + mesa"],
    ["condition", "Estado", "Excelente estado"],
    ["warranty", "Garantia", "Deixar vazio se não houver"],
  ];

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-black text-2xl font-medium">Gerir stock</h1>
            <p className="text-black/50 text-sm mt-1">{utilizador?.email}</p>
          </div>
          <button onClick={sair}
            className="inline-flex items-center gap-2 border border-black/15 text-black text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition-colors">
            <LogOut size={15} /> Sair
          </button>
        </div>

        {msg && (
          <div className="bg-white border border-black/10 rounded-xl px-4 py-3 mb-6 text-sm flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => setMsg("")} className="text-black/40 hover:text-black">
              <X size={15} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 mb-10">
          <h2 className="text-black text-lg font-medium mb-6">
            {aEditar ? "Editar autocaravana" : "Adicionar autocaravana"}
          </h2>

          <form onSubmit={gravar} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campos.map(([campo, etiqueta, exemplo]) => (
                <div key={campo}>
                  <label className={label}>{etiqueta}</label>
                  <input type="text" value={form[campo as keyof typeof vazio]}
                    onChange={alterar(campo)} placeholder={exemplo} className={input} />
                </div>
              ))}

              <div>
                <label className={label}>Estado da venda</label>
                <select value={form.status} onChange={alterar("status")} className={input}>
                  <option value="">Para venda</option>
                  <option value="brevemente">Brevemente</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>
            </div>

            <div>
              <label className={label}>Fotos</label>
              <ImageUploader
                urls={form.images ? form.images.split("\n").filter(Boolean) : []}
                onChange={(novas) => setForm((p) => ({ ...p, images: novas.join("\n") }))}
              />
            </div>

            <div>
              <label className={label}>Equipamento — um item por linha</label>
              <textarea value={form.features} onChange={alterar("features")} rows={5}
                placeholder={"Ar condicionado\nToldo\nPainel solar"}
                className={input + " resize-none"} />
            </div>

            <div>
              <label className={label}>Descrição</label>
              <textarea value={form.description} onChange={alterar("description")} rows={4}
                placeholder="O que quiser contar sobre esta autocaravana..."
                className={input + " resize-none"} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={aGravar}
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-black/85 transition-colors disabled:opacity-50">
                <Plus size={15} />
                {aGravar ? "A gravar..." : aEditar ? "Guardar alterações" : "Adicionar"}
              </button>
              {aEditar && (
                <button type="button" onClick={limpar}
                  className="border border-black/15 text-black text-sm px-6 py-3 rounded-xl hover:bg-black/5 transition-colors">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 className="text-black text-lg font-medium mb-4">
          No stock {!aCarregar && `(${lista.length})`}
        </h2>

        {aCarregar ? (
          <p className="text-black/50 text-sm">A carregar...</p>
        ) : (
          <div className="space-y-2">
            {lista.map((v) => (
              <div key={v.id}
                className="bg-white rounded-xl border border-black/5 px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="block text-black font-medium truncate">{v.name}</span>
                  <span className="block text-black/50 text-sm">
                    {[v.year, v.km, v.price].filter(Boolean).join(" · ")}
                    {v.status === "vendida" && " · Vendida"}
                    {v.status === "brevemente" && " · Brevemente"}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => editar(v)} aria-label="Editar"
                    className="p-2 border border-black/15 rounded-lg hover:bg-black/5 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => apagar(v)} aria-label="Apagar"
                    className="p-2 border border-black/15 rounded-lg hover:bg-red-50 hover:border-red-200 text-red-700 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Entrada ----------
function AdminPage() {
  usePageTitle("Área interna");
  const { utilizador, aCarregar } = useAuth();

  if (aCarregar) {
    return (
      <div className="bg-[#f4f4f2] min-h-screen flex items-center justify-center">
        <p className="text-black/50 text-sm">A verificar sessão...</p>
      </div>
    );
  }

  return utilizador ? <Painel /> : <Login />;
}

export default AdminPage;