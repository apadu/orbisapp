/**
 * Country page: Saudi Arabia (bilingual inline, like romania.js).
 * Facts: population 35.3 million (2024, GASTAT); area about 2.15 million km²; highest peaks about 3,000 m in the Sarawat (Asir); kingdom unified 23 September 1932.
 */
export const SAUDI_ARABIA_PAGE = {
  id: 'sa',
  flag: '🇸🇦',
  name: {"en": "Saudi Arabia", "ro": "Arabia Saudită"},
  tagline: {
    en: "Most of the Arabian Peninsula: Mecca, Medina, the Empty Quarter and 13 regions from the Red Sea to the Gulf.",
    ro: "Cea mai mare parte a Peninsulei Arabice: Mecca, Medina, Sfertul Gol și 13 regiuni de la Marea Roșie la Golf.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Riyadh", ro: "Riad" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "35.3 million (2024)", ro: "35,3 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "about 2.15 million km²", ro: "circa 2,15 milioane km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "13 regions", ro: "13 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "about 3,000 m (Sarawat, Asir)", ro: "circa 3.000 m (Sarawat, Asir)" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Saudi riyal (SAR)", ro: "Rialul saudit (SAR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Arabic", ro: "Arabă" } },
    { icon: '📅', label: { en: "Kingdom", ro: "Regatul" }, value: { en: "unified 23 September 1932", ro: "unificat la 23 septembrie 1932" } },
  ],
  neighbours: { en: "Jordan, Iraq, Kuwait, Qatar, United Arab Emirates, Oman, Yemen", ro: "Iordania, Irak, Kuweit, Qatar, Emiratele Arabe Unite, Oman, Yemen" },
  questions: [
    { id: "capital", q: { en: "Capital of Saudi Arabia", ro: "Capitala Arabiei Saudite" }, answers: ["Riyadh", "Riad", "Ar Riyad"], show: { en: "Riyadh", ro: "Riad" } },
    { id: "mecca", q: { en: "Holiest city of Islam", ro: "Cel mai sfânt oraș al islamului" }, answers: ["Mecca", "Makkah", "Meca"], show: { en: "Mecca", ro: "Mecca" } },
    { id: "hajj", q: { en: "Name of the annual pilgrimage to Mecca", ro: "Numele pelerinajului anual la Mecca" }, answers: ["Hajj", "Hadj", "Haj", "Hadjdj"], show: { en: "Hajj", ro: "Hajj" } },
    { id: "medina", q: { en: "City of the Prophet's Mosque", ro: "Orașul Moscheii Profetului" }, answers: ["Medina", "Madinah", "Al Madinah"], show: { en: "Medina", ro: "Medina" } },
    { id: "jeddah", q: { en: "Red Sea port, the gateway for pilgrims", ro: "Portul de la Marea Roșie, poarta pelerinilor" }, answers: ["Jeddah", "Jedda", "Jidda", "Gedda", "Djeddah"], show: { en: "Jeddah", ro: "Jeddah" } },
    { id: "emptyquarter", q: { en: "Largest sand desert on Earth, in the south", ro: "Cel mai mare deșert de nisip de pe Pământ, în sud" }, answers: ["Rub' al Khali", "Rub al Khali", "Rub al-Khali", "Empty Quarter", "Sfertul Gol", "Rub-al-Khali"], show: { en: "Rub' al Khali (Empty Quarter)", ro: "Rub' al Khali (Sfertul Gol)" } },
    { id: "ibnsaud", q: { en: "King who unified the country in 1932", ro: "Regele care a unificat țara în 1932" }, answers: ["Ibn Saud", "Abdulaziz", "Abdulaziz ibn Saud", "Abdul Aziz", "Abdulaziz Al Saud"], show: { en: "Ibn Saud (Abdulaziz)", ro: "Ibn Saud (Abdulaziz)" } },
    { id: "aramco", q: { en: "State oil company", ro: "Compania petrolieră de stat" }, answers: ["Aramco", "Saudi Aramco"], show: { en: "Saudi Aramco", ro: "Saudi Aramco" } },
    { id: "redsea", q: { en: "Sea on the west coast", ro: "Marea de pe coasta de vest" }, answers: ["Red Sea", "Marea Roșie", "Marea Rosie"], show: { en: "Red Sea", ro: "Marea Roșie" } },
    { id: "gulf", q: { en: "Gulf on the east coast", ro: "Golful de pe coasta de est" }, answers: ["Persian Gulf", "Arabian Gulf", "Gulf", "Golful Persic", "Golful Arabic"], show: { en: "Persian Gulf", ro: "Golful Persic" } },
    { id: "riyal", q: { en: "Currency", ro: "Moneda" }, answers: ["riyal", "rial", "Saudi riyal", "rial saudit", "SAR"], show: { en: "Riyal", ro: "Rial" } },
    { id: "hegra", q: { en: "Nabataean city of rock-cut tombs near AlUla (UNESCO)", ro: "Orașul nabateean cu morminte săpate în stâncă, lângă AlUla (UNESCO)" }, answers: ["Hegra", "Mada'in Salih", "Madain Salih", "Al-Hijr", "Al Hijr"], show: { en: "Hegra (Mada'in Salih)", ro: "Hegra (Mada'in Salih)" } },
    { id: "bahrain", q: { en: "Island country linked by the King Fahd Causeway", ro: "Statul insular legat prin podul Regele Fahd" }, answers: ["Bahrain", "Bahrein"], show: { en: "Bahrain", ro: "Bahrain" } },
    { id: "neom", q: { en: "Megacity project announced in 2017 in the northwest", ro: "Proiectul de megaoraș anunțat în 2017 în nord-vest" }, answers: ["NEOM", "Neom"], show: { en: "NEOM", ro: "NEOM" } },
    { id: "camel", q: { en: "Animal called the \"ship of the desert\"", ro: "Animalul numit „corabia deșertului”" }, answers: ["camel", "dromedary", "cămilă", "camila", "dromader"], show: { en: "Camel", ro: "Cămilă" } },
    { id: "dates", q: { en: "Palm fruit at the heart of its cuisine", ro: "Fructul de palmier din centrul bucătăriei sale" }, answers: ["dates", "date", "curmale", "curmala", "curmală"], show: { en: "Dates", ro: "Curmale" } },
    { id: "kaaba", q: { en: "Cube-shaped shrine at the centre of the Great Mosque of Mecca", ro: "Altarul în formă de cub din centrul Marii Moschei din Mecca" }, answers: ["Kaaba", "Kaabah", "Kaba", "Caaba", "Ka'bah"], show: { en: "Kaaba", ro: "Kaaba" } },
    { id: "1938", q: { en: "Year oil was first struck at Dammam Well No. 7", ro: "Anul în care s-a dat de petrol la Sonda nr. 7 din Dammam" }, answers: ["1938"], show: { en: "1938", ro: "1938" } },
    { id: "asir", q: { en: "Mountainous southwestern region whose capital is Abha", ro: "Regiunea muntoasă din sud-vest cu capitala la Abha" }, answers: ["Asir", "'Asir", "Aseer"], show: { en: "Asir", ro: "Asir" } },
    { id: "1932", q: { en: "Year the kingdom was unified and named", ro: "Anul în care regatul a fost unificat și denumit" }, answers: ["1932"], show: { en: "1932", ro: "1932" } },
  ],
}
