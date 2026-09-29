import { WHATSAPP_NUMBER } from './site-config'

export function whatsappUrl(message: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(message)}`
}

export function productQuoteMessage(
  productName: string,
  selections: { name: string; value: string }[] = [],
  extra?: { quantity?: string; notes?: string },
) {
  const lines = [`Hi Zest Media, I'd like a quote for: ${productName}`]
  for (const s of selections) lines.push(`• ${s.name}: ${s.value}`)
  if (extra?.quantity) lines.push(`• Quantity: ${extra.quantity}`)
  if (extra?.notes) lines.push('', `Notes: ${extra.notes}`)
  return lines.join('\n')
}
