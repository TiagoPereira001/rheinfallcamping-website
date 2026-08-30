import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { api } from "../lib/functions";

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

function ImageUploader({ urls, onChange }: Props) {
  const [aEnviar, setAEnviar] = useState(false);
  const [progresso, setProgresso] = useState({ feitas: 0, total: 0 });
  const [erro, setErro] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const enviarUma = async (ficheiro: File): Promise<string> => {
    if (
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(ficheiro.type) ||
      ficheiro.size > 10 * 1024 * 1024
    ) {
      throw new Error("Formato ou tamanho inválido");
    }

    const assinatura = await api.createVehicleUpload({
      name: ficheiro.name,
      type: ficheiro.type,
      size: ficheiro.size,
    });
    const dados = new FormData();
    dados.append("file", ficheiro);
    dados.append("api_key", assinatura.apiKey);
    dados.append("folder", assinatura.folder);
    dados.append("public_id", assinatura.publicId);
    dados.append("signature", assinatura.signature);
    dados.append("tags", assinatura.tags);
    dados.append("timestamp", String(assinatura.timestamp));
    dados.append("unique_filename", "false");
    dados.append("upload_preset", assinatura.uploadPreset);
    dados.append("use_filename", "false");

    const resposta = await fetch(
      `https://api.cloudinary.com/v1_1/${assinatura.cloudName}/image/upload`,
      { method: "POST", body: dados }
    );

    if (!resposta.ok) throw new Error("Falha no upload");
    const json: unknown = await resposta.json();
    if (
      !json ||
      typeof json !== "object" ||
      typeof (json as { secure_url?: unknown }).secure_url !== "string"
    ) {
      throw new Error("Resposta de upload inválida");
    }

    return (json as { secure_url: string }).secure_url;
  };

  const escolherFicheiros = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiros = Array.from(e.target.files ?? []);
    if (ficheiros.length === 0) return;

    setErro("");
    setAEnviar(true);
    setProgresso({ feitas: 0, total: ficheiros.length });

    const novos: string[] = [];
    for (const f of ficheiros) {
      try {
        const url = await enviarUma(f);
        novos.push(url);
      } catch {
        setErro(`Não foi possível enviar "${f.name}".`);
      }
      setProgresso((p) => ({ ...p, feitas: p.feitas + 1 }));
    }

    onChange([...urls, ...novos]);
    setAEnviar(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remover = (i: number) => {
    onChange(urls.filter((_, idx) => idx !== i));
  };

  const mover = (i: number, direcao: -1 | 1) => {
    const destino = i + direcao;
    if (destino < 0 || destino >= urls.length) return;
    const copia = [...urls];
    [copia[i], copia[destino]] = [copia[destino], copia[i]];
    onChange(copia);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={escolherFicheiros}
        className="hidden"
        id="upload-fotos"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={aEnviar}
        className="inline-flex items-center gap-2 border border-black/15 text-black text-sm px-4 py-2.5 rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50"
      >
        <Upload size={15} />
        {aEnviar
          ? `A enviar ${progresso.feitas}/${progresso.total}...`
          : "Escolher fotos"}
      </button>

      {erro && <p className="text-red-700 text-sm mt-2">{erro}</p>}

      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {urls.map((url, i) => (
            <div key={url} className="relative group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/5 border border-black/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>

              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-black text-white text-[0.625rem] px-2 py-0.5 rounded">
                  Principal
                </span>
              )}

              <button
                type="button"
                onClick={() => remover(i)}
                aria-label="Remover foto"
                className="absolute -top-2 -right-2 bg-white border border-black/15 rounded-full p-1 shadow-sm hover:bg-red-50 hover:border-red-200 text-red-700"
              >
                <X size={13} />
              </button>

              <div className="flex justify-center gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => mover(i, -1)}
                  disabled={i === 0}
                  aria-label="Mover para trás"
                  className="text-black/40 hover:text-black text-xs px-1.5 disabled:opacity-25"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => mover(i, 1)}
                  disabled={i === urls.length - 1}
                  aria-label="Mover para a frente"
                  className="text-black/40 hover:text-black text-xs px-1.5 disabled:opacity-25"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-black/40 text-xs mt-3">
        JPG, PNG, WebP ou AVIF até 10 MB. A primeira foto aparece no stock.
      </p>
    </div>
  );
}

export default ImageUploader;
