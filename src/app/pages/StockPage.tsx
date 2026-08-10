import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import { parseNumero, marcaDoNome } from "../lib/utils";
import VehicleCard from "../components/VehicleCard";

const POR_PAGINA = 6;

const OPCOES_PRECO = [
  { label: "Qualquer preço", min: 0, max: Infinity },
  { label: "Até € 10.000", min: 0, max: 10000 },
  { label: "€ 10.000 - € 20.000", min: 10000, max: 20000 },
  { label: "€ 20.000 - € 30.000", min: 20000, max: 30000 },
  { label: "€ 30.000 - € 40.000", min: 30000, max: 40000 },
  { label: "€ 40.000 - € 50.000", min: 40000, max: 50000 },
  { label: "€ 50.000 - € 65.000", min: 50000, max: 65000 },
  { label: "€ 65.000 - € 80.000", min: 65000, max: 80000 },
  { label: "€ 80.000 - € 100.000", min: 80000, max: 100000 },
  { label: "Mais de € 100.000", min: 100000, max: Infinity },
];

function StockPage() {
  const navigate = useNavigate();
  const { vehicles, loading, error } = useVehicles();

  const [precoIdx, setPrecoIdx] = useState(0);
  const [ano, setAno] = useState("");
  const [marcas, setMarcas] = useState<string[]>([]);
  const [pagina, setPagina] = useState(1);

  // Lista de marcas gerada a partir do stock real
  const marcasDisponiveis = useMemo(() => {
    const set = new Set(vehicles.map((v) => marcaDoNome(v.name)).filter(Boolean));
    return Array.from(set).sort();
  }, [vehicles]);

  // Anos gerados a partir do stock real, do mais recente para o mais antigo
  const anosDisponiveis = useMemo(() => {
    const set = new Set(
      vehicles.map((v) => parseNumero(v.year)).filter((a): a is number => a !== null)
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [vehicles]);

  // Só mostramos escalões de preço onde existe pelo menos uma autocaravana
  const precosDisponiveis = useMemo(() => {
    return OPCOES_PRECO.map((opcao, i) => ({ ...opcao, i })).filter((opcao) => {
      if (opcao.i === 0) return true;
      return vehicles.some((v) => {
        const p = parseNumero(v.price);
        return p !== null && p >= opcao.min && p <= opcao.max;
      });
    });
  }, [vehicles]);

  const filtrados = useMemo(() => {
    const faixaPreco = OPCOES_PRECO[precoIdx];

    return vehicles.filter((v) => {
      const preco = parseNumero(v.price);
      const anoVeiculo = parseNumero(v.year);

      // Se o campo não tiver valor, não excluímos o veículo por causa dele
      const precoOk = preco === null || (preco >= faixaPreco.min && preco <= faixaPreco.max);
      const anoOk = ano === "" || anoVeiculo === null || String(anoVeiculo) === ano;
      const marcaOk = marcas.length === 0 || marcas.includes(marcaDoNome(v.name));

      return precoOk && anoOk && marcaOk;
    });
  }, [vehicles, precoIdx, ano, marcas]);

  // Se os filtros mudarem, voltamos à primeira página
  useEffect(() => {
    setPagina(1);
  }, [precoIdx, ano, marcas]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const alternarMarca = (marca: string) => {
    setMarcas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const limparFiltros = () => {
    setPrecoIdx(0);
    setAno("");
    setMarcas([]);
  };

  const temFiltrosAtivos = precoIdx !== 0 || ano !== "" || marcas.length > 0;

  return (
    <div className="bg-[#f4f4f2] min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <h1 className="font-serif text-black text-4xl md:text-5xl font-medium mb-4">
            O nosso Stock
          </h1>
          <p className="text-black/60 text-sm max-w-xl">
            Explore a nossa coleção de autocaravanas inspecionadas e prontas para a sua próxima viagem.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm sticky top-24">
              <h3 className="font-serif text-lg font-medium mb-6">Filtros</h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="filtro-preco" className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                    Preço
                  </label>
                  <select
                    id="filtro-preco"
                    value={precoIdx}
                    onChange={(e) => setPrecoIdx(Number(e.target.value))}
                    className="w-full bg-[#f4f4f2] text-sm rounded-lg p-2.5 outline-none focus:ring-1 ring-black/20"
                  >
                    {precosDisponiveis.map((o) => (
                      <option key={o.label} value={o.i}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {anosDisponiveis.length > 1 && (
                  <div>
                    <label htmlFor="filtro-ano" className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                      Ano
                    </label>
                    <select
                      id="filtro-ano"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      className="w-full bg-[#f4f4f2] text-sm rounded-lg p-2.5 outline-none focus:ring-1 ring-black/20"
                    >
                      <option value="">Qualquer ano</option>
                      {anosDisponiveis.map((a) => (
                        <option key={a} value={String(a)}>{a}</option>
                      ))}
                    </select>
                  </div>
                )}

                {marcasDisponiveis.length > 1 && (
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
                      Marca
                    </span>
                    <div className="space-y-2">
                      {marcasDisponiveis.map((marca) => (
                        <label key={marca} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={marcas.includes(marca)}
                            onChange={() => alternarMarca(marca)}
                            className="rounded-sm text-black accent-black focus:ring-black"
                          />
                          <span className="text-sm text-black/80">{marca}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {temFiltrosAtivos && (
                <button
                  onClick={limparFiltros}
                  className="w-full bg-black text-white text-sm font-medium py-3 rounded-xl mt-8 hover:bg-black/80 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {loading && <p className="text-black/50 text-sm">A carregar stock...</p>}
            {error && <p className="text-red-700 text-sm">{error}</p>}

            {!loading && !error && vehicles.length === 0 && (
              <p className="text-black/50 text-sm">Ainda não há autocaravanas em stock.</p>
            )}

            {!loading && !error && vehicles.length > 0 && (
              <>
                <p className="text-black/50 text-sm mb-6">
                  {filtrados.length === 1
                    ? "1 autocaravana encontrada"
                    : `${filtrados.length} autocaravanas encontradas`}
                </p>

                {filtrados.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
                    <p className="text-black/60 text-sm mb-4">
                      Nenhuma autocaravana corresponde a estes filtros.
                    </p>
                    <button
                      onClick={limparFiltros}
                      className="text-black text-sm font-medium underline underline-offset-4"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {visiveis.map((v) => (
                      <VehicleCard key={v.id} v={v} onClick={() => navigate(`/stock/${v.id}`)} />
                    ))}
                  </div>
                )}

                {totalPaginas > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={paginaAtual === 1}
                      aria-label="Página anterior"
                      className="p-2 border border-black/10 rounded-lg hover:bg-black/5 text-black/70 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPagina(n)}
                        aria-current={n === paginaAtual ? "page" : undefined}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          n === paginaAtual
                            ? "bg-black text-white"
                            : "hover:bg-black/5 text-black/70"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={paginaAtual === totalPaginas}
                      aria-label="Página seguinte"
                      className="p-2 border border-black/10 rounded-lg hover:bg-black/5 text-black/70 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockPage;