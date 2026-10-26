// IANA time zones per country (game NAME). The first entry is the capital's zone.
// Current offsets (including daylight saving) are computed live with Intl, so "now" is always right.
export const COUNTRY_TZ = {
  // ── Africa ──
  'Algeria': ['Africa/Algiers'], 'Angola': ['Africa/Luanda'], 'Benin': ['Africa/Porto-Novo'],
  'Botswana': ['Africa/Gaborone'], 'Burkina Faso': ['Africa/Ouagadougou'], 'Burundi': ['Africa/Bujumbura'],
  'Cabo Verde': ['Atlantic/Cape_Verde'], 'Cameroon': ['Africa/Douala'], 'Central African Republic': ['Africa/Bangui'],
  'Chad': ['Africa/Ndjamena'], 'Comoros': ['Indian/Comoro'], 'Congo': ['Africa/Brazzaville'],
  'Democratic Republic of Congo': ['Africa/Kinshasa', 'Africa/Lubumbashi'], 'Djibouti': ['Africa/Djibouti'],
  'Egypt': ['Africa/Cairo'], 'Equatorial Guinea': ['Africa/Malabo'], 'Eritrea': ['Africa/Asmara'],
  'Eswatini': ['Africa/Mbabane'], 'Ethiopia': ['Africa/Addis_Ababa'], 'Gabon': ['Africa/Libreville'],
  'Gambia': ['Africa/Banjul'], 'Ghana': ['Africa/Accra'], 'Guinea': ['Africa/Conakry'],
  'Guinea-Bissau': ['Africa/Bissau'], 'Ivory Coast': ['Africa/Abidjan'], 'Kenya': ['Africa/Nairobi'],
  'Lesotho': ['Africa/Maseru'], 'Liberia': ['Africa/Monrovia'], 'Libya': ['Africa/Tripoli'],
  'Madagascar': ['Indian/Antananarivo'], 'Malawi': ['Africa/Blantyre'], 'Mali': ['Africa/Bamako'],
  'Mauritania': ['Africa/Nouakchott'], 'Mauritius': ['Indian/Mauritius'], 'Morocco': ['Africa/Casablanca'],
  'Mozambique': ['Africa/Maputo'], 'Namibia': ['Africa/Windhoek'], 'Niger': ['Africa/Niamey'],
  'Nigeria': ['Africa/Lagos'], 'Rwanda': ['Africa/Kigali'], 'Sao Tome and Principe': ['Africa/Sao_Tome'],
  'Senegal': ['Africa/Dakar'], 'Seychelles': ['Indian/Mahe'], 'Sierra Leone': ['Africa/Freetown'],
  'Somalia': ['Africa/Mogadishu'], 'South Africa': ['Africa/Johannesburg'], 'South Sudan': ['Africa/Juba'],
  'Sudan': ['Africa/Khartoum'], 'Tanzania': ['Africa/Dar_es_Salaam'], 'Togo': ['Africa/Lome'],
  'Tunisia': ['Africa/Tunis'], 'Uganda': ['Africa/Kampala'], 'Zambia': ['Africa/Lusaka'], 'Zimbabwe': ['Africa/Harare'],
  // ── Americas ──
  'Antigua and Barbuda': ['America/Antigua'],
  'Argentina': ['America/Argentina/Buenos_Aires'], 'Bahamas': ['America/Nassau'], 'Barbados': ['America/Barbados'],
  'Belize': ['America/Belize'], 'Bolivia': ['America/La_Paz'],
  'Brazil': ['America/Sao_Paulo', 'America/Manaus', 'America/Rio_Branco', 'America/Noronha'],
  'Canada': ['America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg', 'America/Regina', 'America/Halifax', 'America/St_Johns'],
  'Chile': ['America/Santiago'], 'Colombia': ['America/Bogota'], 'Costa Rica': ['America/Costa_Rica'],
  'Cuba': ['America/Havana'], 'Dominica': ['America/Dominica'], 'Dominican Republic': ['America/Santo_Domingo'],
  'Ecuador': ['America/Guayaquil', 'Pacific/Galapagos'], 'El Salvador': ['America/El_Salvador'],
  'Grenada': ['America/Grenada'], 'Guatemala': ['America/Guatemala'], 'Guyana': ['America/Guyana'],
  'Haiti': ['America/Port-au-Prince'], 'Honduras': ['America/Tegucigalpa'], 'Jamaica': ['America/Jamaica'],
  'Mexico': ['America/Mexico_City', 'America/Cancun', 'America/Hermosillo', 'America/Tijuana', 'America/Mazatlan'],
  'Nicaragua': ['America/Managua'], 'Panama': ['America/Panama'], 'Paraguay': ['America/Asuncion'],
  'Peru': ['America/Lima'], 'Saint Kitts and Nevis': ['America/St_Kitts'], 'Saint Lucia': ['America/St_Lucia'],
  'Saint Vincent and the Grenadines': ['America/St_Vincent'], 'Suriname': ['America/Paramaribo'],
  'Trinidad and Tobago': ['America/Port_of_Spain'],
  'United States of America': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'],
  'Uruguay': ['America/Montevideo'], 'Venezuela': ['America/Caracas'],
  // ── Asia ──
  'Afghanistan': ['Asia/Kabul'], 'Armenia': ['Asia/Yerevan'], 'Azerbaijan': ['Asia/Baku'], 'Bahrain': ['Asia/Bahrain'],
  'Bangladesh': ['Asia/Dhaka'], 'Bhutan': ['Asia/Thimphu'], 'Brunei': ['Asia/Brunei'], 'Cambodia': ['Asia/Phnom_Penh'],
  'China': ['Asia/Shanghai'], 'Cyprus': ['Asia/Nicosia'], 'Georgia': ['Asia/Tbilisi'], 'India': ['Asia/Kolkata'],
  'Indonesia': ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'], 'Iran': ['Asia/Tehran'], 'Iraq': ['Asia/Baghdad'],
  'Israel': ['Asia/Jerusalem'], 'Japan': ['Asia/Tokyo'], 'Jordan': ['Asia/Amman'],
  'Kazakhstan': ['Asia/Almaty', 'Asia/Aqtobe'], 'Kuwait': ['Asia/Kuwait'], 'Kyrgyzstan': ['Asia/Bishkek'],
  'Laos': ['Asia/Vientiane'], 'Lebanon': ['Asia/Beirut'], 'Malaysia': ['Asia/Kuala_Lumpur'], 'Maldives': ['Indian/Maldives'],
  'Mongolia': ['Asia/Ulaanbaatar', 'Asia/Hovd'], 'Myanmar': ['Asia/Yangon'], 'Nepal': ['Asia/Kathmandu'],
  'North Korea': ['Asia/Pyongyang'], 'Oman': ['Asia/Muscat'], 'Pakistan': ['Asia/Karachi'], 'Palestine': ['Asia/Hebron'],
  'Philippines': ['Asia/Manila'], 'Qatar': ['Asia/Qatar'], 'Saudi Arabia': ['Asia/Riyadh'], 'Singapore': ['Asia/Singapore'],
  'South Korea': ['Asia/Seoul'], 'Sri Lanka': ['Asia/Colombo'], 'Syria': ['Asia/Damascus'], 'Taiwan': ['Asia/Taipei'],
  'Tajikistan': ['Asia/Dushanbe'], 'Thailand': ['Asia/Bangkok'], 'Timor-Leste': ['Asia/Dili'], 'Turkey': ['Europe/Istanbul'],
  'Turkmenistan': ['Asia/Ashgabat'], 'United Arab Emirates': ['Asia/Dubai'], 'Uzbekistan': ['Asia/Tashkent'],
  'Vietnam': ['Asia/Ho_Chi_Minh'], 'Yemen': ['Asia/Aden'],
  // ── Europe ──
  'Albania': ['Europe/Tirane'], 'Andorra': ['Europe/Andorra'], 'Austria': ['Europe/Vienna'], 'Belarus': ['Europe/Minsk'],
  'Belgium': ['Europe/Brussels'], 'Bosnia and Herzegovina': ['Europe/Sarajevo'], 'Bulgaria': ['Europe/Sofia'],
  'Croatia': ['Europe/Zagreb'], 'Czech Republic': ['Europe/Prague'], 'Denmark': ['Europe/Copenhagen'],
  'Estonia': ['Europe/Tallinn'], 'Finland': ['Europe/Helsinki'], 'France': ['Europe/Paris'], 'Germany': ['Europe/Berlin'],
  'Greece': ['Europe/Athens'], 'Hungary': ['Europe/Budapest'], 'Iceland': ['Atlantic/Reykjavik'], 'Ireland': ['Europe/Dublin'],
  'Italy': ['Europe/Rome'], 'Kosovo': ['Europe/Belgrade'], 'Latvia': ['Europe/Riga'], 'Liechtenstein': ['Europe/Vaduz'],
  'Lithuania': ['Europe/Vilnius'], 'Luxembourg': ['Europe/Luxembourg'], 'Malta': ['Europe/Malta'], 'Moldova': ['Europe/Chisinau'],
  'Monaco': ['Europe/Monaco'], 'Montenegro': ['Europe/Podgorica'], 'Netherlands': ['Europe/Amsterdam'],
  'North Macedonia': ['Europe/Skopje'], 'Norway': ['Europe/Oslo'], 'Poland': ['Europe/Warsaw'],
  'Portugal': ['Europe/Lisbon', 'Atlantic/Azores'], 'Romania': ['Europe/Bucharest'],
  'Russia': ['Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka'],
  'San Marino': ['Europe/San_Marino'], 'Serbia': ['Europe/Belgrade'], 'Slovakia': ['Europe/Bratislava'],
  'Slovenia': ['Europe/Ljubljana'], 'Spain': ['Europe/Madrid', 'Atlantic/Canary'], 'Sweden': ['Europe/Stockholm'],
  'Switzerland': ['Europe/Zurich'], 'Ukraine': ['Europe/Kyiv'], 'United Kingdom': ['Europe/London'], 'Vatican': ['Europe/Vatican'],
  // ── Oceania ──
  'Australia': ['Australia/Sydney', 'Australia/Brisbane', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth'],
  'Fiji': ['Pacific/Fiji'], 'Kiribati': ['Pacific/Tarawa', 'Pacific/Kiritimati'], 'Marshall Islands': ['Pacific/Majuro'],
  'Federated States of Micronesia': ['Pacific/Pohnpei', 'Pacific/Chuuk'], 'Nauru': ['Pacific/Nauru'],
  'New Zealand': ['Pacific/Auckland'], 'Palau': ['Pacific/Palau'], 'Papua New Guinea': ['Pacific/Port_Moresby'],
  'Samoa': ['Pacific/Apia'], 'Solomon Islands': ['Pacific/Guadalcanal'], 'Tonga': ['Pacific/Tongatapu'],
  'Tuvalu': ['Pacific/Funafuti'], 'Vanuatu': ['Pacific/Efate'],
}

/** Current UTC offset of an IANA zone, in minutes (DST-aware). */
export function zoneOffsetMin(zone, at = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(at)
  const g = (t) => Number(parts.find(p => p.type === t).value)
  const asUTC = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'))
  return Math.round((asUTC - Math.floor(at.getTime() / 60000) * 60000) / 60000)
}

/** Distinct current offsets (minutes) for a country. */
export function countryOffsets(name, at = new Date()) {
  return [...new Set((COUNTRY_TZ[name] ?? []).map(z => zoneOffsetMin(z, at)))]
}
