/** UK mobile shown on site — also used for WhatsApp. */
export const WHATSAPP_PHONE_DISPLAY = '07717 751734'

/** E.164 digits for wa.me links (no + prefix). */
export const WHATSAPP_PHONE_E164 = '447717751734'

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE_E164}`
  if (!message?.trim()) return base
  return `${base}?text=${encodeURIComponent(message.trim())}`
}
