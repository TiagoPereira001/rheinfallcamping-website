import type { Vehicle } from "../hooks/useVehicles";

function VehicleCard({ v, onClick }: { v: Vehicle; onClick: (v: Vehicle) => void }) {
  const brevemente = v.status === "brevemente";

  return (
    <article
      onClick={() => onClick(v)}
      className="bg-black rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full"
    >
      <div className="bg-[#1c1c1c] h-52 overflow-hidden relative">
        {v.image && (
          <img
            src={v.image}
            alt={`${v.name} — autocaravana`}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.04] transition-all duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {brevemente && (
          <span className="absolute top-4 left-4 bg-[#C2A07A] text-white text-[0.6875rem] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full">
            Brevemente
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-white text-xl font-medium mb-3 leading-snug">
          {v.name}
        </h3>
        <div className="flex items-center gap-3 text-white/45 text-xs mb-6">
          {v.year && <span>{v.year}</span>}
          {v.year && v.km && <span className="w-px h-3 bg-white/20" />}
          {v.km && <span>{v.km}</span>}
          {v.km && v.price && <span className="w-px h-3 bg-white/20" />}
          {v.price && <span className="text-white/80 font-medium">{v.price}</span>}
        </div>
        <div className="mt-auto">
          <button className="w-full bg-white text-black text-[0.8125rem] font-medium py-3 rounded-xl group-hover:bg-[#d6d6d4] transition-colors duration-200">
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}

export default VehicleCard;