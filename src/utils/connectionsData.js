/**
 * Country Connections rounds.
 * Each round has 4 categories, each with exactly 4 countries.
 * difficulty: 0=yellow (easy), 1=green, 2=blue, 3=purple (hard)
 */
export const CONNECTIONS_ROUNDS = [
  {
    categories: [
      { label: 'Countries in Scandinavia',            difficulty: 0, countries: ['Sweden', 'Norway', 'Denmark', 'Finland'] },
      { label: 'Countries that border France',         difficulty: 1, countries: ['Germany', 'Spain', 'Italy', 'Switzerland'] },
      { label: 'Island nations in the Caribbean',      difficulty: 2, countries: ['Cuba', 'Jamaica', 'Haiti', 'Barbados'] },
      { label: 'Countries with "Stan" in the name',   difficulty: 3, countries: ['Kazakhstan', 'Pakistan', 'Afghanistan', 'Uzbekistan'] },
    ],
  },
  {
    categories: [
      { label: 'South American countries',             difficulty: 0, countries: ['Brazil', 'Argentina', 'Colombia', 'Venezuela'] },
      { label: 'Countries in the Horn of Africa',      difficulty: 1, countries: ['Ethiopia', 'Somalia', 'Eritrea', 'Djibouti'] },
      { label: 'Countries in Southeast Asia',          difficulty: 2, countries: ['Thailand', 'Vietnam', 'Malaysia', 'Indonesia'] },
      { label: 'Countries completely surrounded by one other country', difficulty: 3, countries: ['Lesotho', 'Vatican', 'San Marino', 'Monaco'] },
    ],
  },
  {
    categories: [
      { label: 'Countries with a red and white flag', difficulty: 0, countries: ['Canada', 'Japan', 'Switzerland', 'Turkey'] },
      { label: 'Countries that use the Euro',          difficulty: 1, countries: ['France', 'Germany', 'Italy', 'Spain'] },
      { label: 'Landlocked countries in Africa',       difficulty: 2, countries: ['Mali', 'Niger', 'Chad', 'Zambia'] },
      { label: 'Countries with a dragon on their flag', difficulty: 3, countries: ['Bhutan', 'Wales', 'Malta', 'Moldova'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Balkans',             difficulty: 0, countries: ['Serbia', 'Croatia', 'Bosnia and Herzegovina', 'Albania'] },
      { label: 'Countries in the Sahel',               difficulty: 1, countries: ['Senegal', 'Burkina Faso', 'Niger', 'Sudan'] },
      { label: 'Countries with Arabic as official language', difficulty: 2, countries: ['Morocco', 'Tunisia', 'Jordan', 'Lebanon'] },
      { label: 'Largest countries in the world by area', difficulty: 3, countries: ['Russia', 'Canada', 'China', 'Brazil'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Caucasus',            difficulty: 0, countries: ['Georgia', 'Armenia', 'Azerbaijan', 'Turkey'] },
      { label: 'Former Soviet Baltic states',          difficulty: 1, countries: ['Estonia', 'Latvia', 'Lithuania', 'Belarus'] },
      { label: 'Countries in Central America',         difficulty: 2, countries: ['Guatemala', 'Honduras', 'Nicaragua', 'Panama'] },
      { label: 'Countries that start with "New"',      difficulty: 3, countries: ['New Zealand', 'Papua New Guinea', 'Vanuatu', 'Fiji'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in West Africa',             difficulty: 0, countries: ['Nigeria', 'Ghana', 'Senegal', 'Guinea'] },
      { label: 'Countries bordering Russia',           difficulty: 1, countries: ['Finland', 'Estonia', 'Ukraine', 'Georgia'] },
      { label: 'Countries in the Arabian Peninsula',   difficulty: 2, countries: ['Saudi Arabia', 'Yemen', 'Oman', 'Qatar'] },
      { label: 'Most populous countries in the world', difficulty: 3, countries: ['India', 'China', 'United States', 'Indonesia'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in East Africa',             difficulty: 0, countries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'] },
      { label: 'Island countries in the Indian Ocean', difficulty: 1, countries: ['Maldives', 'Sri Lanka', 'Mauritius', 'Comoros'] },
      { label: 'Countries that border Germany',        difficulty: 2, countries: ['France', 'Poland', 'Austria', 'Netherlands'] },
      { label: 'Countries with a population under 1 million', difficulty: 3, countries: ['Iceland', 'Bhutan', 'Djibouti', 'Vanuatu'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Maghreb',             difficulty: 0, countries: ['Morocco', 'Algeria', 'Tunisia', 'Libya'] },
      { label: 'Countries in the Caucasus region',     difficulty: 1, countries: ['Armenia', 'Georgia', 'Azerbaijan', 'Iran'] },
      { label: 'Countries with French as official language', difficulty: 2, countries: ['Belgium', 'Switzerland', 'Senegal', 'Cameroon'] },
      { label: 'Countries that have won the FIFA World Cup', difficulty: 3, countries: ['Brazil', 'Germany', 'Italy', 'Argentina'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in Southern Africa',         difficulty: 0, countries: ['South Africa', 'Zimbabwe', 'Zambia', 'Mozambique'] },
      { label: 'Countries in the Mekong region',       difficulty: 1, countries: ['China', 'Myanmar', 'Laos', 'Cambodia'] },
      { label: 'Countries without a coastline in South America', difficulty: 2, countries: ['Bolivia', 'Paraguay'] },
      { label: 'Countries whose name is also an adjective', difficulty: 3, countries: ['Turkey', 'Jordan', 'Ivory Coast', 'Niger'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Iberian Peninsula',   difficulty: 0, countries: ['Spain', 'Portugal', 'Andorra', 'Morocco'] },
      { label: 'Countries bordering China',            difficulty: 1, countries: ['Russia', 'Mongolia', 'Kazakhstan', 'Vietnam'] },
      { label: 'Countries that changed their name after 1990', difficulty: 2, countries: ['Czech Republic', 'Myanmar', 'Cambodia', 'Eswatini'] },
      { label: 'Countries where driving is on the left', difficulty: 3, countries: ['United Kingdom', 'Japan', 'India', 'Australia'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Persian Gulf',        difficulty: 0, countries: ['Iran', 'Kuwait', 'Bahrain', 'Qatar'] },
      { label: 'Countries in Central Asia',            difficulty: 1, countries: ['Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan'] },
      { label: 'Countries whose flags have a cross',   difficulty: 2, countries: ['Sweden', 'Denmark', 'Switzerland', 'Finland'] },
      { label: 'Countries that border Brazil',         difficulty: 3, countries: ['Venezuela', 'Colombia', 'Peru', 'Argentina'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Great Lakes region',  difficulty: 0, countries: ['Uganda', 'Rwanda', 'Burundi', 'Tanzania'] },
      { label: 'Countries in the Pacific Ring of Fire', difficulty: 1, countries: ['Japan', 'Philippines', 'Indonesia', 'Chile'] },
      { label: 'Countries in the former Yugoslavia',   difficulty: 2, countries: ['Slovenia', 'Croatia', 'Serbia', 'Montenegro'] },
      { label: 'Countries that border the Black Sea',  difficulty: 3, countries: ['Romania', 'Bulgaria', 'Turkey', 'Ukraine'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in North Africa',            difficulty: 0, countries: ['Egypt', 'Libya', 'Tunisia', 'Algeria'] },
      { label: 'Countries in Polynesia',               difficulty: 1, countries: ['Samoa', 'Tonga', 'Vanuatu', 'Fiji'] },
      { label: 'Countries with Spanish as official language', difficulty: 2, countries: ['Mexico', 'Colombia', 'Peru', 'Chile'] },
      { label: 'Countries that are G7 members',        difficulty: 3, countries: ['United States', 'United Kingdom', 'France', 'Japan'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Levant',              difficulty: 0, countries: ['Israel', 'Lebanon', 'Jordan', 'Syria'] },
      { label: 'Countries that border India',          difficulty: 1, countries: ['Pakistan', 'Nepal', 'Bhutan', 'Bangladesh'] },
      { label: 'Countries in the Caribbean that are independent nations', difficulty: 2, countries: ['Cuba', 'Dominican Republic', 'Jamaica', 'Trinidad and Tobago'] },
      { label: 'Smallest countries in Europe by area', difficulty: 3, countries: ['Monaco', 'Liechtenstein', 'Andorra', 'Malta'] },
    ],
  },
  {
    categories: [
      { label: 'Countries in the Balkans',             difficulty: 0, countries: ['Bulgaria', 'Romania', 'Serbia', 'North Macedonia'] },
      { label: 'Countries in the Gulf of Guinea',      difficulty: 1, countries: ['Nigeria', 'Cameroon', 'Gabon', 'Equatorial Guinea'] },
      { label: 'Countries with Portuguese as official language', difficulty: 2, countries: ['Brazil', 'Portugal', 'Angola', 'Mozambique'] },
      { label: 'Countries that border the Caspian Sea', difficulty: 3, countries: ['Russia', 'Azerbaijan', 'Iran', 'Kazakhstan'] },
    ],
  },
]

export const DIFF_COLORS = {
  0: { bg: '#7e5a00', active: '#ffce00', label: 'Easy',   text: '#FFD700' },
  1: { bg: '#1a4d1a', active: '#39ff14', label: 'Medium', text: '#39ff14' },
  2: { bg: '#003380', active: '#5ba3f5', label: 'Hard',   text: '#5ba3f5' },
  3: { bg: '#4a0050', active: '#c77dff', label: 'Expert', text: '#c77dff' },
}
