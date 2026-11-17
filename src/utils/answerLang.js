/**
 * Keeps typed answers in the site language. Data often lists every accepted spelling in one
 * array (English, Romanian and native names mixed); this drops the ones that belong to the
 * *other* language, keeping native names, numbers and abbreviations for both.
 */
import { isRo } from '../i18n'
import { COUNTRY_RO } from '../i18n/countriesRo'

const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const squash = (s) => norm(s).replace(/ /g, '')

const RO_WORDS = new Set(`regatul imperiul republica marea muntii muntele lacul fluviul raul insula insulele orasul varful sfantul sfanta
  turnul podul palatul piata catedrala castelul limba limbi statul statele uniunea tara tarile cascada cascadele golful oceanul padurea
  poarta zidul muzeul cetatea drumul tratatul statuia vulturul acvila flori al si din de la cu lui
  unu doi trei patru cinci sase sapte opt noua zece treisprezece cincizeci
  ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie
  dolar dolarul lira yeni franci marca lire parmezan cires canguri cangur hochei vultur columb copernic carol ioan ungaria germania rusia otomani tarista
  pirineii padul rinul prutul nistrul oltul amazonul pacificul baltica dunare apenini baleare tagul tag vaticanul gulas
  romanice romanic romanica portugheza edinburg leul inferioara superioara jos sus`.split(/\s+/))
const EN_WORDS = new Set(`the of kingdom empire republic river mount mountains lake island islands peak tower bridge palace great
  state states union cathedral castle falls sea ocean bay desert gate wall museum treaty statue forest house old city
  one two three four five six seven eight nine ten thirteen fifty
  january february march april may june july august september october november december
  dollar pound sterling mark christ columbus copernicus john charles king stephen eagle liberty lady coliseum parmesan
  hockey maple leaf bullet train cherry blossom blossoms opera barrier reef baltic marseilles cracow kishinev
  eurotunnel chunnel peoples tsarist imperial ottomans hungarian britain lower upper north south east west
  northern southern eastern western`.split(/\s+/))
// Country names that differ between the languages ("Hungary" / "Ungaria") are a signal too
for (const [en, ro] of Object.entries(COUNTRY_RO)) {
  const e = norm(en), r = norm(ro)
  if (e === r) continue
  if (!e.includes(' ')) EN_WORDS.add(e)
  if (!r.includes(' ')) RO_WORDS.add(r)
}
// words both languages share, never a signal on their own
const SHARED = new Set(['august', 'mai', 'lira', 'de', 'la', 'al'])

/** 'ro' | 'en' | null (either language). Diacritics alone prove nothing: Comăneci is a name in English too. */
export function answerLang(a) {
  const words = norm(a).split(' ').filter(w => !SHARED.has(w))
  if (words.some(w => RO_WORDS.has(w))) return 'ro'
  if (words.some(w => EN_WORDS.has(w))) return 'en'
  return null
}

/**
 * The answers that count in the current language.
 * names: { en, ro } — the item's own name in each language, when known (the strongest signal).
 */
export function inSiteLang(answers, names) {
  const mine = isRo ? 'ro' : 'en', other = isRo ? 'en' : 'ro'
  const own = names?.[mine] != null ? squash(names[mine]) : null
  const foreign = names?.[other] != null && squash(names[other]) !== own ? squash(names[other]) : null
  const out = answers.filter(a => {
    const k = squash(a)
    if (own != null && k === own) return true
    if (foreign != null && k === foreign) return false
    return answerLang(a) !== other
  })
  return out.length ? out : answers   // never leave an item unanswerable
}
