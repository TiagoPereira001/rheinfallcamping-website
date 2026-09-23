// Extrai o número de um texto como "€ 42.500" ou "45.000 km" -> 42500 / 45000
export function parseNumero(texto?: string): number | null {
  if (!texto) return null;
  const apenasDigitos = texto.replace(/[^\d]/g, "");
  if (!apenasDigitos) return null;
  return parseInt(apenasDigitos, 10);
}

// A marca é a primeira palavra do nome. Ex: "Hymer B-Klasse 580" -> "Hymer"
export function marcaDoNome(nome?: string): string {
  if (!nome) return "";
  return nome.trim().split(/\s+/)[0];
}

// Aceita algo parecido com um email ou um telefone — não valida a fundo,
// só evita enviar texto sem qualquer hipótese de ser um contacto real
// (ex: "asdf"), que nunca poderíamos responder.
export function pareceContacto(texto: string): boolean {
  const t = texto.trim();
  if (t.includes("@") && t.length >= 5) return true;
  const digitos = t.replace(/[^\d]/g, "");
  return digitos.length >= 9;
}