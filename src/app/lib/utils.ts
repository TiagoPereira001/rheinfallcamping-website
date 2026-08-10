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