/**
 * Flag emoji → ISO 3166-1 alpha-2 code ('🇫🇷' → 'fr').
 * Windows (and some Linux setups) can't draw flag emoji and show "FR" letters instead,
 * so wherever the flag *is* the question we render a real image.
 */
export function flagCode(emoji) {
  if (!emoji) return null
  const cps = [...emoji].map(c => c.codePointAt(0))
  if (cps.length !== 2 || cps.some(p => p < 0x1F1E6 || p > 0x1F1FF)) return null
  return cps.map(p => String.fromCharCode(p - 0x1F1E6 + 97)).join('')
}

const base = () => (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '')
export const localFlagSrc  = (code) => `${base()}/flags/${code}.svg`
export const remoteFlagSrc = (code) => `https://flagcdn.com/${code}.svg`
