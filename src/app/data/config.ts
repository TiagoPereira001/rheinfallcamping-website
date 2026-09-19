// Configurações do negócio — muda aqui e aplica-se ao site todo.

// Número de WhatsApp: indicativo do país + número, sem espaços nem "+"
export const WHATSAPP_NUMBER = "351961848490";

export const LOCATION = "Covilhã";

// Número de telefone formatado para mostrar, ex: "961 848 490"
export const phoneDisplay = WHATSAPP_NUMBER.replace("351", "").replace(
  /(\d{3})(\d{3})(\d{3})/,
  "$1 $2 $3"
);

// Cria um link de WhatsApp com a mensagem já preenchida
export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// A configuração da Cloudinary (cloud name, preset, api key/secret) já não
// vive aqui — o upload é assinado pela Cloud Function createVehicleUpload,
// a partir da secret CLOUDINARY_CONFIG. Ver funções/README ou o runbook.