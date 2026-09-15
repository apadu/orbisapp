// Simulated "% of players who name this" for each item.
// Based on expected global geography knowledge — higher = easier/more commonly known.

const COUNTRY_PCT = {
  'United States': 99, 'France': 97, 'Germany': 97, 'United Kingdom': 96,
  'Spain': 95, 'Italy': 95, 'Brazil': 94, 'China': 94, 'Japan': 94,
  'Australia': 93, 'Canada': 93, 'Russia': 92, 'India': 92, 'Mexico': 91,
  'Argentina': 90, 'Portugal': 89, 'Netherlands': 89, 'Switzerland': 88,
  'Greece': 88, 'Turkey': 88, 'Egypt': 87, 'South Africa': 87,
  'Sweden': 86, 'Norway': 86, 'Denmark': 86, 'Austria': 85, 'Belgium': 85,
  'Poland': 84, 'Ukraine': 83, 'Saudi Arabia': 82, 'South Korea': 82,
  'Thailand': 81, 'Indonesia': 80, 'New Zealand': 80, 'Chile': 79,
  'Colombia': 79, 'Peru': 78, 'Venezuela': 78, 'Morocco': 77,
  'Nigeria': 76, 'Kenya': 75, 'Cuba': 75, 'Iran': 74, 'Iraq': 74,
  'Israel': 74, 'North Korea': 73, 'Vietnam': 73, 'Philippines': 72,
  'Pakistan': 72, 'Bangladesh': 71, 'Romania': 71, 'Hungary': 70,
  'Czech Republic': 70, 'Finland': 70, 'Ireland': 70, 'Iceland': 69,
  'Croatia': 68, 'Slovakia': 68, 'Algeria': 67, 'Libya': 66,
  'Tunisia': 66, 'Ghana': 65, 'Ethiopia': 64, 'Tanzania': 63,
  'Zimbabwe': 62, 'Cambodia': 62, 'Malaysia': 61, 'Ecuador': 61,
  'Bolivia': 60, 'Haiti': 60, 'Guatemala': 59, 'Paraguay': 59,
  'Uruguay': 58, 'Bulgaria': 58, 'Serbia': 57, 'Jordan': 57,
  'Lebanon': 56, 'Syria': 56, 'Yemen': 55, 'Nepal': 55, 'Sri Lanka': 55,
  'Dominican Republic': 54, 'Honduras': 53, 'Nicaragua': 52,
  'Panama': 52, 'Costa Rica': 52, 'El Salvador': 51, 'Jamaica': 51,
  'Myanmar': 50, 'Mongolia': 50, 'Afghanistan': 49,
  'United Arab Emirates': 49, 'Kuwait': 48, 'Qatar': 48, 'Bahrain': 47,
  'Oman': 47, 'Cyprus': 47, 'Luxembourg': 46, 'Malta': 46,
  'Vatican City': 45, 'Monaco': 45, 'Andorra': 45, 'Slovenia': 44,
  'Albania': 44, 'Moldova': 43, 'Belarus': 43,
  'Bosnia and Herzegovina': 42, 'North Macedonia': 41, 'Kazakhstan': 41,
  'Uzbekistan': 40, 'Liechtenstein': 40, 'San Marino': 39,
  'Mozambique': 39, 'Senegal': 39, 'Cameroon': 38,
  'Ivory Coast': 37, 'Uganda': 37, 'Mali': 36, 'Burkina Faso': 35,
  'Angola': 35, 'Zambia': 34, 'Botswana': 34, 'Rwanda': 33,
  'Sudan': 33, 'South Sudan': 32, 'Namibia': 31, 'Malawi': 31,
  'Niger': 30, 'Chad': 30, 'Democratic Republic of Congo': 29,
  'Republic of Congo': 28, 'Gabon': 28, 'Madagascar': 27,
  'Mauritania': 27, 'Eritrea': 26, 'Somalia': 25, 'Djibouti': 24,
  'Benin': 24, 'Togo': 23, 'Sierra Leone': 22, 'Liberia': 22,
  'Guinea': 21, 'Guinea-Bissau': 20, 'Gambia': 20,
  'Equatorial Guinea': 19, 'Central African Republic': 18, 'Burundi': 18,
  'Papua New Guinea': 37, 'Fiji': 35, 'Belize': 33,
  'Trinidad and Tobago': 32, 'Bahamas': 31, 'Barbados': 30,
  'Georgia': 29, 'Armenia': 29, 'Azerbaijan': 27, 'Tajikistan': 26,
  'Turkmenistan': 25, 'Kyrgyzstan': 24, 'Latvia': 28, 'Estonia': 27,
  'Lithuania': 29, 'Montenegro': 26, 'Kosovo': 25,
  'Timor-Leste': 24, 'Brunei': 24, 'Bhutan': 22, 'Maldives': 21,
  'Eswatini': 19, 'Lesotho': 19, 'Solomon Islands': 19,
  'Vanuatu': 18, 'Samoa': 18, 'Tonga': 17,
  'Saint Lucia': 21, 'Grenada': 20,
  'Saint Vincent and the Grenadines': 18, 'Antigua and Barbuda': 17,
  'Dominica': 16, 'Saint Kitts and Nevis': 15,
  'Comoros': 16, 'Sao Tome and Principe': 13,
  'Nauru': 17, 'Tuvalu': 12, 'Kiribati': 11, 'Palau': 14,
  'Marshall Islands': 10, 'Federated States of Micronesia': 9,
}

const SEA_PCT = {
  'Mediterranean Sea': 90, 'Red Sea': 82, 'Black Sea': 78,
  'Caspian Sea': 72, 'Arabian Sea': 68, 'Caribbean Sea': 76,
  'Gulf of Mexico': 74, 'North Sea': 73, 'Baltic Sea': 71,
  'South China Sea': 65, 'East China Sea': 58, 'Yellow Sea': 55,
  'Sea of Japan': 60, 'Coral Sea': 52, 'Tasman Sea': 48,
  'Bay of Bengal': 55, 'Persian Gulf': 62, 'Gulf of Guinea': 40,
  'Gulf of Aden': 42, 'Andaman Sea': 38, 'Java Sea': 35,
  'Celebes Sea': 30, 'Banda Sea': 28, 'Timor Sea': 32,
  'Arafura Sea': 30, 'Bismarck Sea': 26, 'Solomon Sea': 25,
  'Bering Sea': 50, 'Sea of Okhotsk': 42, 'Barents Sea': 38,
  'Norwegian Sea': 40, 'Greenland Sea': 35, 'Labrador Sea': 32,
  'Hudson Bay': 55, 'Beaufort Sea': 30, 'Chukchi Sea': 28,
  'Gulf of Thailand': 38, 'Strait of Malacca': 35,
  'Ligurian Sea': 40, 'Tyrrhenian Sea': 42, 'Adriatic Sea': 48,
  'Ionian Sea': 44, 'Aegean Sea': 55, 'Marmara Sea': 42,
  'Sea of Azov': 38, 'Kara Sea': 28, 'Laptev Sea': 22,
  'East Siberian Sea': 20, 'Sargasso Sea': 45, 'Weddell Sea': 28,
  'Ross Sea': 25, 'Amundsen Sea': 18, 'Scotia Sea': 20,
}

const RIVER_PCT = {
  'Nile': 90, 'Amazon': 90, 'Mississippi': 85, 'Yangtze': 78,
  'Rhine': 75, 'Danube': 72, 'Thames': 72, 'Seine': 70,
  'Volga': 68, 'Ganges': 70, 'Mekong': 62, 'Niger': 58,
  'Congo': 60, 'Zambezi': 55, 'Lena': 48, 'Ob': 42,
  'Yenisei': 40, 'Amur': 42, 'Irrawaddy': 38, 'Tigris': 65,
  'Euphrates': 65, 'Indus': 62, 'Brahmaputra': 50, 'Yellow River': 60,
  'Orinoco': 52, 'Paraná': 48, 'Uruguay': 40, 'Rio Grande': 65,
  'Colorado': 60, 'Columbia': 55, 'Mackenzie': 42, 'Yukon': 38,
  'Murray': 50, 'Darling': 40, 'Vistula': 45, 'Oder': 42,
  'Elbe': 52, 'Tagus': 48, 'Douro': 42, 'Ebro': 45,
  'Po': 50, 'Tiber': 55, 'Rhône': 55, 'Loire': 52,
  'Meuse': 40, 'Moselle': 38, 'Main': 42, 'Weser': 38,
  'Dnieper': 45, 'Dniester': 35, 'Don': 45, 'Ural': 35,
  'Ob-Irtysh': 32, 'Irtysh': 35, 'Tobol': 28, 'Kama': 32,
  'Oka': 35, 'Pechora': 28, 'Kolyma': 25, 'Indigirka': 20,
  'Salween': 35, 'Chao Phraya': 40, 'Tonle Sap': 32,
  'Ayeyarwady': 35, 'Fly': 22, 'Sepik': 20,
  'Senegal': 38, 'Gambia': 35, 'Volta': 40, 'Benue': 32,
  'Ubangi': 28, 'Kasai': 25, 'Orange': 38, 'Limpopo': 35,
  'Rufiji': 28, 'Tana': 25, 'Blue Nile': 55, 'White Nile': 50,
  'Atbara': 32, 'Sobat': 22, 'Jubba': 20, 'Shebelle': 18,
  'Prut': 28, 'Sava': 32, 'Drava': 28, 'Tisza': 30,
  'Mura': 24, 'Drina': 25, 'Morava': 25, 'Vardar': 22,
  'Maritsa': 28, 'Arda': 20, 'Struma': 22,
  'Guadalquivir': 45, 'Minho': 32, 'Guadiana': 35, 'Júcar': 28,
  'Segura': 25, 'Arno': 42, 'Adige': 35, 'Piave': 28,
}

/** Returns a simulated "% of players who guess this" for a given item and game type */
export function getDifficulty(type, name) {
  if (type === 'countries') {
    return COUNTRY_PCT[name] ?? 30
  }
  if (type === 'capitals') {
    // Capitals are harder — multiply base by 0.68
    const base = COUNTRY_PCT[name] ?? 30
    return Math.round(base * 0.68)
  }
  if (type === 'currencies') {
    const base = COUNTRY_PCT[name] ?? 30
    return Math.round(base * 0.52)
  }
  if (type === 'languages') {
    const base = COUNTRY_PCT[name] ?? 30
    return Math.round(base * 0.60)
  }
  if (type === 'seas') {
    return SEA_PCT[name] ?? 25
  }
  if (type === 'rivers') {
    return RIVER_PCT[name] ?? 22
  }
  return 30
}

/** Completion rate for the full game (% of starters who reach 100%) */
export const COMPLETION_RATE = {
  countries:   14,
  capitals:    8,
  currencies:  5,
  languages:   7,
  seas:        19,
  rivers:      9,
}
