/**
 * "Lists & groups" and "smaller target" quizzes — name every country in a set.
 * Pure data + one helper; the TableQuiz engine plays them.
 */
import { COUNTRY_INFO } from '../utils/countryInfo'
import { t, locale } from '../i18n'

// ── Sets ───────────────────────────────────────────────────────────────────
const LANDLOCKED = [
  'Afghanistan', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Bhutan', 'Bolivia', 'Botswana',
  'Burkina Faso', 'Burundi', 'Central African Republic', 'Chad', 'Czech Republic', 'Eswatini', 'Ethiopia',
  'Hungary', 'Kazakhstan', 'Kosovo', 'Kyrgyzstan', 'Laos', 'Lesotho', 'Liechtenstein', 'Luxembourg', 'Malawi',
  'Mali', 'Moldova', 'Mongolia', 'Nepal', 'Niger', 'North Macedonia', 'Paraguay', 'Rwanda', 'San Marino',
  'Serbia', 'Slovakia', 'South Sudan', 'Switzerland', 'Tajikistan', 'Turkmenistan', 'Uganda', 'Uzbekistan',
  'Vatican', 'Zambia', 'Zimbabwe',
]

const ISLAND_NATIONS = [
  'Antigua and Barbuda', 'Bahamas', 'Bahrain', 'Barbados', 'Cabo Verde', 'Comoros', 'Cuba', 'Cyprus', 'Dominica',
  'Dominican Republic', 'Fiji', 'Grenada', 'Haiti', 'Iceland', 'Indonesia', 'Ireland', 'Jamaica', 'Japan',
  'Kiribati', 'Madagascar', 'Maldives', 'Malta', 'Marshall Islands', 'Mauritius', 'Federated States of Micronesia',
  'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Philippines', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'Sao Tome and Principe', 'Seychelles', 'Singapore',
  'Solomon Islands', 'Sri Lanka', 'Timor-Leste', 'Tonga', 'Trinidad and Tobago', 'Tuvalu', 'United Kingdom', 'Vanuatu',
]

// EU members → year joined
const EU = {
  Belgium: 1957, France: 1957, Germany: 1957, Italy: 1957, Luxembourg: 1957, Netherlands: 1957,
  Denmark: 1973, Ireland: 1973, Greece: 1981, Portugal: 1986, Spain: 1986,
  Austria: 1995, Finland: 1995, Sweden: 1995,
  Cyprus: 2004, 'Czech Republic': 2004, Estonia: 2004, Hungary: 2004, Latvia: 2004, Lithuania: 2004,
  Malta: 2004, Poland: 2004, Slovakia: 2004, Slovenia: 2004,
  Bulgaria: 2007, Romania: 2007, Croatia: 2013,
}

// NATO members → year joined
const NATO = {
  Belgium: 1949, Canada: 1949, Denmark: 1949, France: 1949, Iceland: 1949, Italy: 1949, Luxembourg: 1949,
  Netherlands: 1949, Norway: 1949, Portugal: 1949, 'United Kingdom': 1949, 'United States of America': 1949,
  Greece: 1952, Turkey: 1952, Germany: 1955, Spain: 1982,
  'Czech Republic': 1999, Hungary: 1999, Poland: 1999,
  Bulgaria: 2004, Estonia: 2004, Latvia: 2004, Lithuania: 2004, Romania: 2004, Slovakia: 2004, Slovenia: 2004,
  Albania: 2009, Croatia: 2009, Montenegro: 2017, 'North Macedonia': 2020, Finland: 2023, Sweden: 2024,
}

const G20 = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India', 'Indonesia', 'Italy',
  'Japan', 'Mexico', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Turkey', 'United Kingdom',
  'United States of America',
]

const FORMER_USSR = [
  'Armenia', 'Azerbaijan', 'Belarus', 'Estonia', 'Georgia', 'Kazakhstan', 'Kyrgyzstan', 'Latvia', 'Lithuania',
  'Moldova', 'Russia', 'Tajikistan', 'Turkmenistan', 'Ukraine', 'Uzbekistan',
]

const FORMER_YUGOSLAVIA = ['Bosnia and Herzegovina', 'Croatia', 'Kosovo', 'Montenegro', 'North Macedonia', 'Serbia', 'Slovenia']

const EQUATOR = [
  'Ecuador', 'Colombia', 'Brazil', 'Sao Tome and Principe', 'Gabon', 'Congo', 'Democratic Republic of Congo',
  'Uganda', 'Kenya', 'Somalia', 'Maldives', 'Indonesia', 'Kiribati',
]

const STAN = ['Afghanistan', 'Kazakhstan', 'Kyrgyzstan', 'Pakistan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan']

const SPANISH = [
  'Spain', 'Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba',
  'Dominican Republic', 'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Chile', 'Argentina', 'Uruguay',
  'Paraguay', 'Equatorial Guinea',
]

const PORTUGUESE = [
  'Portugal', 'Brazil', 'Angola', 'Mozambique', 'Cabo Verde', 'Guinea-Bissau', 'Sao Tome and Principe',
  'Timor-Leste', 'Equatorial Guinea',
]

const FRENCH = [
  'France', 'Belgium', 'Switzerland', 'Luxembourg', 'Monaco', 'Canada', 'Haiti', 'Senegal', 'Mali', 'Niger',
  'Chad', 'Ivory Coast', 'Burkina Faso', 'Guinea', 'Benin', 'Togo', 'Cameroon', 'Gabon', 'Congo',
  'Democratic Republic of Congo', 'Central African Republic', 'Madagascar', 'Comoros', 'Djibouti', 'Burundi',
  'Rwanda', 'Seychelles', 'Vanuatu', 'Equatorial Guinea',
]

// Flag features
const FLAG_CRESCENT = [
  'Algeria', 'Azerbaijan', 'Comoros', 'Libya', 'Malaysia', 'Maldives', 'Mauritania', 'Pakistan', 'Singapore',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Uzbekistan',
]
const FLAG_CROSS = [
  'Denmark', 'Norway', 'Sweden', 'Finland', 'Iceland', 'Switzerland', 'Greece', 'United Kingdom',
  'Dominican Republic', 'Georgia', 'Tonga', 'Jamaica', 'Burundi',
]
const FLAG_SUN = [
  'Argentina', 'Uruguay', 'Kazakhstan', 'Kyrgyzstan', 'Rwanda', 'Malawi', 'Namibia', 'Philippines', 'Nepal',
  'Antigua and Barbuda', 'Kiribati', 'North Macedonia',
]

// ── Round 2 ────────────────────────────────────────────────────────────────
// Euro users → year adopted ("agreement"/"unilateral" for non-EU users)
const EURO = {
  Austria: 1999, Belgium: 1999, Finland: 1999, France: 1999, Germany: 1999, Ireland: 1999, Italy: 1999,
  Luxembourg: 1999, Netherlands: 1999, Portugal: 1999, Spain: 1999,
  Greece: 2001, Slovenia: 2007, Cyprus: 2008, Malta: 2008, Slovakia: 2009, Estonia: 2011, Latvia: 2014,
  Lithuania: 2015, Croatia: 2023, Bulgaria: 2026,
  Andorra: 'by agreement', Monaco: 'by agreement', 'San Marino': 'by agreement', Vatican: 'by agreement',
  Kosovo: 'unilaterally', Montenegro: 'unilaterally',
}

const CAPITAL_SHARES_NAME = [
  'Djibouti', 'Guatemala', 'Mexico', 'Panama', 'Kuwait', 'Singapore', 'Luxembourg', 'Monaco', 'San Marino',
  'Vatican', 'Sao Tome and Principe', 'Andorra', 'Tunisia', 'Brazil',
]

const CARIBBEAN = [
  'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Cuba', 'Dominica', 'Dominican Republic', 'Grenada', 'Haiti',
  'Jamaica', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago',
]
const CENTRAL_AMERICA = ['Belize', 'Costa Rica', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama']
const NORDIC = ['Denmark', 'Finland', 'Iceland', 'Norway', 'Sweden']
const GULF = ['Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'United Arab Emirates']

// ── Helpers ────────────────────────────────────────────────────────────────
const continentOf = (n) => COUNTRY_INFO[n]?.continent ?? '—'

/**
 * Build a "name every country in this set" quiz.
 * hint(name) → text shown in the hint column (defaults to the continent).
 */
function listQuiz({ title, icon, prompt, names, hint = continentOf, hintLabel = 'Continent', sortBy = 'hint', regions = true }) {
  return {
    title, icon, prompt, regions,
    columns: { hint: hintLabel, answer: t('Country') },
    build: ({ countries, region, countryAnswers, inRegion }) => names
      .filter(n => countries.includes(n) && inRegion(n, region))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: String(hint(n)) }, answers: countryAnswers(n), display: n }))
      .sort((a, b) => sortBy === 'hint'
        ? (String(a.hint.value).localeCompare(String(b.hint.value), undefined, { numeric: true }) || a.display.localeCompare(b.display))
        : a.display.localeCompare(b.display)),
  }
}

// ── Catalogue ──────────────────────────────────────────────────────────────
export const LIST_QUIZZES = {
  landlocked:    listQuiz({ title: t('Landlocked Countries'), icon: '🏔️', prompt: t('Name every country with no coastline'), names: LANDLOCKED }),
  'island-nations': listQuiz({ title: t('Island Nations'), icon: '🏝️', prompt: t('Name every country made up entirely of islands'), names: ISLAND_NATIONS }),
  'eu-members':  listQuiz({ title: t('EU Members'), icon: '🇪🇺', prompt: t('Name all 27 members of the European Union'), names: Object.keys(EU), hint: n => EU[n], hintLabel: 'Joined', regions: false }),
  'nato-members': listQuiz({ title: t('NATO Members'), icon: '🛡️', prompt: t('Name all 32 NATO members'), names: Object.keys(NATO), hint: n => NATO[n], hintLabel: 'Joined', regions: false }),
  g20:           listQuiz({ title: t('G20 Countries'), icon: '💼', prompt: t('Name the 19 countries in the G20'), names: G20, regions: false }),
  'former-ussr': listQuiz({ title: t('Former Soviet Republics'), icon: '☭', prompt: t('Name the 15 countries that were part of the USSR'), names: FORMER_USSR, regions: false }),
  'former-yugoslavia': listQuiz({ title: t('Former Yugoslavia'), icon: '🧩', prompt: t('Name the 7 countries that came out of Yugoslavia'), names: FORMER_YUGOSLAVIA, regions: false }),
  equator:       listQuiz({ title: t('On the Equator'), icon: '🌐', prompt: t('Name every country the Equator passes through'), names: EQUATOR, regions: false }),
  stans:         listQuiz({ title: t('The -stans'), icon: '🐎', prompt: t('Name every country ending in "-stan"'), names: STAN, hint: () => '…stan', hintLabel: 'Ends in', sortBy: 'name', regions: false }),
  'spanish-speaking':    listQuiz({ title: t('Spanish-speaking Countries'), icon: '🇪🇸', prompt: t('Name every country where Spanish is official'), names: SPANISH, regions: false }),
  'portuguese-speaking': listQuiz({ title: t('Portuguese-speaking Countries'), icon: '🇵🇹', prompt: t('Name every country where Portuguese is official'), names: PORTUGUESE, regions: false }),
  'french-speaking':     listQuiz({ title: t('French-speaking Countries'), icon: '🇫🇷', prompt: t('Name every country where French is official'), names: FRENCH }),
  'flags-crescent': listQuiz({ title: t('Flags with a Crescent'), icon: '☪️', prompt: t('Name every country whose flag has a crescent moon'), names: FLAG_CRESCENT, regions: false }),
  'flags-cross':    listQuiz({ title: t('Flags with a Cross'), icon: '✝️', prompt: t('Name every country whose flag has a cross or saltire'), names: FLAG_CROSS, regions: false }),
  'flags-sun':      listQuiz({ title: t('Flags with a Sun'), icon: '☀️', prompt: t('Name every country whose flag has a sun'), names: FLAG_SUN, regions: false }),

  'euro-users':   listQuiz({ title: t('Countries Using the Euro'), icon: '💶', prompt: t('Name every country that uses the euro'), names: Object.keys(EURO), hint: n => EURO[n], hintLabel: 'Since', regions: false }),
  'dollar-users': {
    title: t('Countries Using a Dollar'), icon: '💵', regions: true,
    prompt: t('Name every country whose currency is a dollar (its own or another country\'s)'),
    columns: { hint: t('Continent'), answer: t('Country') },
    build: ({ countries, region, countryAnswers, inRegion, currency }) => countries
      .filter(n => /Dollar/.test(currency[n]?.name ?? '') && inRegion(n, region))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: COUNTRY_INFO[n]?.continent ?? '—' }, answers: countryAnswers(n), display: n }))
      .sort((a, b) => a.hint.value.localeCompare(b.hint.value) || a.display.localeCompare(b.display)),
  },
  'english-speaking': {
    title: t('English-speaking Countries'), icon: '🇬🇧', regions: true,
    prompt: t('Name every country where English is an official or main language'),
    columns: { hint: t('Continent'), answer: t('Country') },
    build: ({ countries, region, countryAnswers, inRegion, languages }) => countries
      .filter(n => languages[n]?.includes('English') && inRegion(n, region))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: COUNTRY_INFO[n]?.continent ?? '—' }, answers: countryAnswers(n), display: n }))
      .sort((a, b) => a.hint.value.localeCompare(b.hint.value) || a.display.localeCompare(b.display)),
  },
  'arabic-speaking': {
    title: t('Arabic-speaking Countries'), icon: '🕌', regions: false,
    prompt: t('Name every country where Arabic is an official or main language'),
    columns: { hint: t('Continent'), answer: t('Country') },
    build: ({ countries, region, countryAnswers, inRegion, languages }) => countries
      .filter(n => languages[n]?.includes('Arabic') && inRegion(n, region))
      .map(n => ({ id: n, country: n, hint: { type: 'text', value: COUNTRY_INFO[n]?.continent ?? '—' }, answers: countryAnswers(n), display: n }))
      .sort((a, b) => a.hint.value.localeCompare(b.hint.value) || a.display.localeCompare(b.display)),
  },
  'capital-same-name': listQuiz({ title: t('Capital Shares the Name'), icon: '🪞', prompt: t('Name every country whose capital (almost) shares its name — e.g. Mexico → Mexico City'), names: CAPITAL_SHARES_NAME, regions: false }),
  caribbean:         listQuiz({ title: t('Caribbean Countries'), icon: '🌴', prompt: t('Name the 13 island countries of the Caribbean'), names: CARIBBEAN, hint: n => n.length, hintLabel: 'Letters', sortBy: 'name', regions: false }),
  'central-america': listQuiz({ title: t('Central America'), icon: '🌋', prompt: t('Name the 7 countries of Central America'), names: CENTRAL_AMERICA, hint: n => n.length, hintLabel: 'Letters', sortBy: 'name', regions: false }),
  nordic:            listQuiz({ title: t('Nordic Countries'), icon: '❄️', prompt: t('Name the 5 Nordic countries'), names: NORDIC, hint: n => n.length, hintLabel: 'Letters', sortBy: 'name', regions: false }),
  'gulf-states':     listQuiz({ title: t('Gulf States (GCC)'), icon: '🛢️', prompt: t('Name the 6 members of the Gulf Cooperation Council'), names: GULF, hint: n => n.length, hintLabel: 'Letters', sortBy: 'name', regions: false }),
  smallest: {
    title: t('Smallest Countries'), icon: '🔬', ranked: true, regions: false,
    prompt: t('Name the 20 smallest countries by area'),
    columns: { hint: '#', extra: t('Area'), answer: t('Country') },
    build: ({ countries, countryAnswers, area }) => countries
      .filter(n => area[n])
      .sort((a, b) => area[a] - area[b])
      .slice(0, 20)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: `${i + 1}` }, extra: area[n] < 10 ? `${area[n].toFixed(2)} km²` : `${Math.round(area[n]).toLocaleString(locale)} km²`, answers: countryAnswers(n), display: n })),
  },
  'least-populous': {
    title: t('Least Populous Countries'), icon: '🧍', ranked: true, regions: false,
    prompt: t('Name the 20 countries with the fewest people'),
    columns: { hint: '#', extra: t('Population'), answer: t('Country') },
    build: ({ countries, countryAnswers, population }) => countries
      .filter(n => population[n])
      .sort((a, b) => population[a] - population[b])
      .slice(0, 20)
      .map((n, i) => ({ id: n, country: n, hint: { type: 'text', value: `${i + 1}` }, extra: population[n] >= 1 ? `${population[n].toFixed(1)} M` : `${Math.round(population[n] * 1000).toLocaleString(locale)} k`, answers: countryAnswers(n), display: n })),
  },
  'capitals-a-z': {
    title: t('Capitals A to Z'), icon: '🔠', regions: true,
    prompt: t('Name one capital city for every letter of the alphabet'),
    columns: { hint: t('Letter'), answer: t('Capital') },
    build: ({ countries, region, inRegion, capitals }) => {
      const byLetter = {}
      for (const n of countries) {
        if (!capitals[n] || !inRegion(n, region)) continue
        for (const cap of capitals[n]) {
          const l = cap.normalize('NFD').replace(/[\u0300-\u036f]/g, '')[0]?.toUpperCase()
          if (!l || !/[A-Z]/.test(l)) continue
          ;(byLetter[l] ??= {})[cap] = { show: cap, country: n }
        }
      }
      return Object.keys(byLetter).sort().map(l => ({
        id: `cap-letter-${l}`, country: null,
        hint: { type: 'text', value: l, mono: true },
        answers: Object.keys(byLetter[l]),
        labels: byLetter[l],
        display: `${t('e.g.')} ${Object.values(byLetter[l]).map(v => v.show).sort()[0]}`,
      }))
    },
  },

  // One country per letter — any country starting with that letter fills the row
  alphabet: {
    title: t('A to Z'), icon: '🔤', regions: true, anyOf: true,
    prompt: t('Name one country for every letter of the alphabet'),
    columns: { hint: t('Letter'), answer: t('Country') },
    build: ({ countries, region, countryAnswers, inRegion }) => {
      const byLetter = {}
      for (const n of countries) {
        if (!inRegion(n, region)) continue
        const l = n[0].toUpperCase()
        ;(byLetter[l] ??= []).push(n)
      }
      return Object.keys(byLetter).sort().map(l => ({
        id: `letter-${l}`,
        country: null,
        hint: { type: 'text', value: l, mono: true },
        answers: byLetter[l].flatMap(n => countryAnswers(n).filter(a => a[0].toUpperCase() === l || a === n)),
        labels: Object.fromEntries(byLetter[l].flatMap(n => countryAnswers(n).map(a => [a, n]))),
        display: `${t('e.g.')} ${byLetter[l].sort()[0]}`,
      }))
    },
  },
}
