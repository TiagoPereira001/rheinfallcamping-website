import type { Vehicle } from "../hooks/useVehicles";

function VehicleCard({ v, onClick }: { v: Vehicle; onClick: (v: Vehicle) => void }) {
  const brevemente = v.status === "brevemente";
  const vendida = v.status === "vendida";
  const mainImage = v.images?.[0] || v.image;

  const etiqueta = vendida ? "Vendida" : brevemente ? "Brevemente" : "Para venda";
  const corEtiqueta = vendida ? "bg-[#b02020]" : brevemente ? "bg-[#C2A07A]" : "bg-[#2f7d4f]";

  return (
    <article
      onClick={() => onClick(v)}
      className="bg-black rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full"
    >
      <div className="bg-[#1c1c1c] h-52 overflow-hidden relative">
        {mainImage && (
          <img
            src={mainImage}
            alt={`${v.name} — autocaravana`}
            className={`w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ${
              vendida ? "grayscale opacity-70" : ""
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
        <span
          className={`absolute top-4 left-4 text-white text-[0.6875rem] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full ${corEtiqueta}`}
        >
          {etiqueta}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-white text-xl font-medium mb-3 leading-snug">
          {v.name}
        </h3>
        <div className="flex items-center gap-3 text-white/45 text-xs mb-6">
          {v.year && <span>{v.year}</span>}
          {v.year && v.km && <span className="w-px h-3 bg-white/20" />}
          {v.km && <span>{v.km}</span>}
          {v.km && v.price && !vendida && <span className="w-px h-3 bg-white/20" />}
          {v.price && !vendida && (
            <span className="text-white/80 font-medium">{v.price}</span>
          )}
        </div>
        <div className="mt-auto">
          <button
            className={`w-full text-[0.8125rem] font-medium py-3 rounded-xl transition-colors duration-200 ${
              vendida
                ? "bg-white/10 text-white/60"
                : "bg-white text-black group-hover:bg-[#d6d6d4]"
            }`}
          >
            {vendida ? "Ver autocaravana" : "Ver detalhes"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default VehicleCard;1