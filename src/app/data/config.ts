// Configurações do negócio — muda aqui e aplica-se ao site todo.

// Número de WhatsApp: indicativo do país + número, sem espaços nem "+"
export const WHATSAPP_NUMBER = "351961848490";

export const LOCATION = "Covilhã";

// Cria um link de WhatsApp com a mensagem já preenchida
export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
