import { COUNTRY_CURRENCY } from './countryCurrency'
import { COUNTRY_LANGUAGES } from './countryLanguages'
import { COUNTRY_INFO } from './countryInfo'

// Countries with no coastline (canonical app names)
export const LANDLOCKED = new Set([
  'Afghanistan', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Bhutan',
  'Bolivia', 'Botswana', 'Burkina Faso', 'Burundi', 'Central African Republic',
  'Chad', 'Czech Republic', 'Ethiopia', 'Hungary', 'Kazakhstan', 'Kosovo',
  'Kyrgyzstan', 'Laos', 'Lesotho', 'Liechtenstein', 'Luxembourg', 'Malawi',
  'Mali', 'Moldova', 'Mongolia', 'Nepal', 'Niger', 'North Macedonia',
  'Paraguay', 'Rwanda', 'Serbia', 'Slovakia', 'South Sudan', 'Eswatini',
  'Switzerland', 'Tajikistan', 'Turkmenistan', 'Uganda', 'Uzbekistan',
  'Zambia', 'Zimbabwe',
])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n)
}

function makeOption(name) {
  return { name, flag: COUNTRY_INFO[name]?.flag ?? '🏳️' }
}

export function generateQuestion(gameCountries, lastCategory = null) {
  const names = gameCountries.map(f => f.properties.NAME)

  // Rotate categories so we don't repeat the same type twice in a row
  const all = ['currency', 'language', 'landlocked']
  const cats = lastCategory ? shuffle(all.filter(c => c !== lastCategory)) : shuffle(all)

  for (const cat of cats) {
    const q = tryCategory(cat, names)
    if (q) return q
  }
  return null
}

function tryCategory(cat, names) {
  if (cat === 'currency') {
    const groups = {}
    for (const name of names) {
      const cur = COUNTRY_CURRENCY[name]?.name
      if (!cur) continue
      if (!groups[cur]) groups[cur] = []
      groups[cur].push(name)
    }
    const eligible = Object.entries(groups).filter(([, v]) => v.length >= 4)
    if (!eligible.length) return null
    const [currencyName, members] = eligible[Math.floor(Math.random() * eligible.length)]
    const three = pick(members, 3)
    const others = names.filter(n => !three.includes(n) && COUNTRY_CURRENCY[n]?.name !== currencyName && COUNTRY_CURRENCY[n])
    if (!others.length) return null
    const odd = others[Math.floor(Math.random() * others.length)]
    const options = shuffle([...three.map(makeOption), makeOption(odd)])
    return {
      options,
      oddIndex: options.findIndex(o => o.name === odd),
      category: 'currency',
      prompt: 'Which country uses a different currency?',
      sharedLabel: `The others all use the ${currencyName}`,
    }
  }

  if (cat === 'language') {
    const groups = {}
    for (const name of names) {
      const lang = COUNTRY_LANGUAGES[name]?.[0]
      if (!lang) continue
      if (!groups[lang]) groups[lang] = []
      groups[lang].push(name)
    }
    const eligible = Object.entries(groups).filter(([, v]) => v.length >= 4)
    if (!eligible.length) return null
    const [langName, members] = eligible[Math.floor(Math.random() * eligible.length)]
    const three = pick(members, 3)
    const others = names.filter(n => !three.includes(n) && COUNTRY_LANGUAGES[n]?.[0] !== langName && COUNTRY_LANGUAGES[n])
    if (!others.length) return null
    const odd = others[Math.floor(Math.random() * others.length)]
    const options = shuffle([...three.map(makeOption), makeOption(odd)])
    return {
      options,
      oddIndex: options.findIndex(o => o.name === odd),
      category: 'language',
      prompt: 'Which country has a different official language?',
      sharedLabel: `The others all have ${langName} as their primary official language`,
    }
  }

  if (cat === 'landlocked') {
    const ll = names.filter(n => LANDLOCKED.has(n))
    const coastal = names.filter(n => !LANDLOCKED.has(n))
    const variant = Math.random() < 0.5 ? 'find-coastal' : 'find-landlocked'

    if (variant === 'find-coastal' && ll.length >= 3 && coastal.length >= 1) {
      const three = pick(ll, 3)
      const odd = coastal[Math.floor(Math.random() * coastal.length)]
      const options = shuffle([...three.map(makeOption), makeOption(odd)])
      return {
        options,
        oddIndex: options.findIndex(o => o.name === odd),
        category: 'landlocked',
        prompt: 'Which country has a coastline?',
        sharedLabel: 'The others are all landlocked',
      }
    }
    if (coastal.length >= 3 && ll.length >= 1) {
      const three = pick(coastal, 3)
      const odd = ll[Math.floor(Math.random() * ll.length)]
      const options = shuffle([...three.map(makeOption), makeOption(odd)])
      return {
        options,
        oddIndex: options.findIndex(o => o.name === odd),
        category: 'landlocked',
        prompt: 'Which country is landlocked?',
        sharedLabel: 'The others all have a coastline',
      }
    }
    return null
  }

  return null
}
