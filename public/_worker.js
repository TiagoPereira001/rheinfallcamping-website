// Cloudflare Pages worker: nas páginas /stock/<id> injeta no HTML as etiquetas de
// partilha (Open Graph / Twitter) do veículo. O site é uma SPA e os crawlers do
// WhatsApp/Facebook não executam JavaScript, por isso sem isto todas as ligações
// mostravam a imagem genérica do index.html. Só corre em /stock/* (ver _routes.json).
//
// Imagem de partilha: usa /images/<pasta>/og.jpg se existir (JPEG leve, 1200x630 —
// o WhatsApp falha com imagens grandes ou WebP); senão usa a primeira foto do veículo.

const PROJETO = "rheinfallcamping2";
const SITE = "https://rheinfallcamping.pt";

const texto = (campo) => campo?.stringValue ?? "";

async function lerVeiculo(id) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJETO}/databases/(default)/documents/vehicles/${encodeURIComponent(id)}`;
  const resposta = await fetch(url, { cf: { cacheTtl: 60, cacheEverything: true } });
  if (!resposta.ok) return null;
  const f = (await resposta.json()).fields ?? {};
  const fotos = (f.images?.arrayValue?.values ?? []).map(texto).filter(Boolean);
  return {
    nome: texto(f.name),
    ano: texto(f.year),
    km: texto(f.km),
    preco: texto(f.price).replace(/^(\d+)$/, "$1€"),
    estado: texto(f.status),
    descricao: texto(f.description),
    foto: fotos[0] || texto(f.image),
  };
}

function absoluto(caminho) {
  return /^https?:\/\//.test(caminho) ? caminho : `${SITE}${caminho.startsWith("/") ? "" : "/"}${caminho}`;
}

async function imagemDePartilha(foto, env) {
  const pasta = foto.startsWith("/") ? foto.slice(0, foto.lastIndexOf("/")) : "";
  if (pasta) {
    const og = await env.ASSETS.fetch(new Request(`${SITE}${pasta}/og.jpg`, { method: "HEAD" }));
    if (og.ok && (og.headers.get("content-type") || "").startsWith("image/")) {
      return { url: absoluto(`${pasta}/og.jpg`), dimensoes: true };
    }
  }
  return { url: absoluto(foto), dimensoes: false };
}

function cortar(s, n) {
  return s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`;
}

export default {
  async fetch(pedido, env) {
    const original = () => env.ASSETS.fetch(pedido);

    try {
      const url = new URL(pedido.url);
      const m = url.pathname.match(/^\/stock\/([^/]+)\/?$/);
      if (pedido.method !== "GET" || !m) return original();

      const veiculo = await lerVeiculo(decodeURIComponent(m[1]));
      if (!veiculo || !veiculo.nome || !veiculo.foto) return original();

      const pagina = await original();
      if (!(pagina.headers.get("content-type") || "").includes("text/html")) return pagina;

      const imagem = await imagemDePartilha(veiculo.foto, env);
      const titulo = `${veiculo.nome}${veiculo.estado === "vendida" ? " (vendida)" : ""} — RheinfallCamping`;
      const resumo = [veiculo.ano, veiculo.km, veiculo.estado === "vendida" ? "" : veiculo.preco]
        .filter(Boolean)
        .join(" · ");
      const descricao = cortar(
        [resumo, veiculo.descricao.replace(/\s+/g, " ").trim()].filter(Boolean).join(" — ") ||
          "Autocaravana usada na Covilhã.",
        200
      );
      const ligacao = `${SITE}${url.pathname}`;

      const conteudo = (valor) => ({ element: (e) => e.setAttribute("content", valor) });
      const semDimensoes = imagem.dimensoes ? {} : { element: (e) => e.remove() };

      return new HTMLRewriter()
        .on("title", { element: (e) => e.setInnerContent(titulo) })
        .on('meta[name="description"]', conteudo(descricao))
        .on('meta[property="og:title"]', conteudo(titulo))
        .on('meta[property="og:description"]', conteudo(descricao))
        .on('meta[property="og:url"]', conteudo(ligacao))
        .on('meta[property="og:image"]', conteudo(imagem.url))
        .on('meta[property="og:image:alt"]', conteudo(`${veiculo.nome} — autocaravana`))
        .on('meta[property="og:image:width"]', semDimensoes)
        .on('meta[property="og:image:height"]', semDimensoes)
        .on('meta[name="twitter:title"]', conteudo(titulo))
        .on('meta[name="twitter:description"]', conteudo(descricao))
        .on('meta[name="twitter:image"]', conteudo(imagem.url))
        .on('link[rel="canonical"]', { element: (e) => e.setAttribute("href", ligacao) })
        .transform(pagina);
    } catch {
      return original();
    }
  },
};
