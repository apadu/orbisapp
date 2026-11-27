/**
 * Country page: Kenya (bilingual inline, like romania.js).
 * Facts: population 47.6 million (2019 census, KNBS); area 580,367 km²; Mount Kenya 5,199 m; independence 12 December 1963.
 */
export const KENYA_PAGE = {
  id: 'ke',
  flag: '🇰🇪',
  name: {"en": "Kenya", "ro": "Kenya"},
  tagline: {
    en: "Savannah, the Great Rift Valley and the Indian Ocean coast: 47 counties astride the equator.",
    ro: "Savană, Marele Rift și coasta Oceanului Indian: 47 de comitate de-a lungul ecuatorului.",
  },
  mapHint: { en: "Hover or tap a county", ro: "Treci cu mouse-ul sau atinge un comitat" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Nairobi", ro: "Nairobi" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "47.6 million (2019 census)", ro: "47,6 milioane (recensământul din 2019)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "580,367 km²", ro: "580.367 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "47 counties", ro: "47 de comitate" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Kenya, 5,199 m", ro: "Muntele Kenya, 5.199 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Kenyan shilling (KES)", ro: "Șilingul kenyan (KES)" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Swahili, English", ro: "Swahili, engleză" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "12 December 1963", ro: "12 decembrie 1963" } },
  ],
  neighbours: { en: "Ethiopia, Somalia, Tanzania, Uganda, South Sudan", ro: "Etiopia, Somalia, Tanzania, Uganda, Sudanul de Sud" },
  questions: [
    { id: "capital", q: { en: "Capital of Kenya", ro: "Capitala statului Kenya" }, answers: ["Nairobi"], show: { en: "Nairobi", ro: "Nairobi" } },
    { id: "mtkenya", q: { en: "Highest mountain, which gave the country its name", ro: "Cel mai înalt munte, care a dat numele țării" }, answers: ["Mount Kenya", "Kenya", "Muntele Kenya", "Kirinyaga"], show: { en: "Mount Kenya", ro: "Muntele Kenya" } },
    { id: "mombasa", q: { en: "Main port, on the Indian Ocean", ro: "Principalul port, la Oceanul Indian" }, answers: ["Mombasa"], show: { en: "Mombasa", ro: "Mombasa" } },
    { id: "mara", q: { en: "Reserve of the great wildebeest migration", ro: "Rezervația marii migrații a gnu" }, answers: ["Maasai Mara", "Masai Mara", "Mara"], show: { en: "Maasai Mara", ro: "Maasai Mara" } },
    { id: "maasai", q: { en: "Semi-nomadic herders known for red shukas and the jumping dance", ro: "Păstorii seminomazi cunoscuți pentru pelerinele roșii și dansul cu sărituri" }, answers: ["Maasai", "Masai", "Masaii", "Maasaii"], show: { en: "Maasai", ro: "Masai" } },
    { id: "victoria", q: { en: "Largest lake, shared with Uganda and Tanzania", ro: "Cel mai mare lac, împărțit cu Uganda și Tanzania" }, answers: ["Lake Victoria", "Victoria", "Lacul Victoria"], show: { en: "Lake Victoria", ro: "Lacul Victoria" } },
    { id: "turkana", q: { en: "Desert lake in the far north, the \"Jade Sea\"", ro: "Lacul din deșertul din nord, „Marea de jad”" }, answers: ["Lake Turkana", "Turkana", "Lacul Turkana", "Lake Rudolf"], show: { en: "Lake Turkana", ro: "Lacul Turkana" } },
    { id: "kenyatta", q: { en: "Independence leader and first president", ro: "Liderul independenței și primul președinte" }, answers: ["Jomo Kenyatta", "Kenyatta"], show: { en: "Jomo Kenyatta", ro: "Jomo Kenyatta" } },
    { id: "maathai", q: { en: "Environmentalist, 2004 Nobel Peace Prize (Green Belt Movement)", ro: "Ecologista laureată cu Nobelul pentru Pace în 2004 (Mișcarea Centura Verde)" }, answers: ["Wangari Maathai", "Maathai", "Wangari"], show: { en: "Wangari Maathai", ro: "Wangari Maathai" } },
    { id: "kipchoge", q: { en: "Runner who first ran a marathon in under 2 hours (2019, unofficial)", ro: "Alergătorul care a terminat primul un maraton sub 2 ore (2019, neoficial)" }, answers: ["Eliud Kipchoge", "Kipchoge"], show: { en: "Eliud Kipchoge", ro: "Eliud Kipchoge" } },
    { id: "swahili", q: { en: "National language, spoken across East Africa", ro: "Limba națională, vorbită în toată Africa de Est" }, answers: ["Swahili", "Kiswahili", "swahili"], show: { en: "Swahili", ro: "Swahili" } },
    { id: "shilling", q: { en: "Currency", ro: "Moneda" }, answers: ["shilling", "Kenyan shilling", "șiling", "siling", "KES"], show: { en: "Kenyan shilling", ro: "Șiling kenyan" } },
    { id: "rift", q: { en: "Great geological trench running through the country", ro: "Marele șanț geologic care traversează țara" }, answers: ["Great Rift Valley", "Rift Valley", "Rift", "Marele Rift", "Valea Riftului"], show: { en: "Great Rift Valley", ro: "Marele Rift" } },
    { id: "equator", q: { en: "Line of latitude that crosses the country", ro: "Paralela care traversează țara" }, answers: ["Equator", "the Equator", "Ecuator", "Ecuatorul"], show: { en: "Equator", ro: "Ecuatorul" } },
    { id: "nakuru", q: { en: "Rift Valley lake famous for its flamingos", ro: "Lacul din Rift celebru pentru flamingi" }, answers: ["Lake Nakuru", "Nakuru", "Lacul Nakuru"], show: { en: "Lake Nakuru", ro: "Lacul Nakuru" } },
    { id: "blixen", q: { en: "Danish author of \"Out of Africa\", who farmed near Nairobi", ro: "Autoarea daneză a cărții „Out of Africa”, care a avut o fermă lângă Nairobi" }, answers: ["Karen Blixen", "Blixen", "Isak Dinesen"], show: { en: "Karen Blixen", ro: "Karen Blixen" } },
    { id: "amboseli", q: { en: "Park of elephants with Kilimanjaro in the background", ro: "Parcul elefanților cu Kilimanjaro în fundal" }, answers: ["Amboseli", "Amboseli National Park"], show: { en: "Amboseli", ro: "Amboseli" } },
    { id: "lamu", q: { en: "Island town of old Swahili architecture (UNESCO)", ro: "Orașul insular cu arhitectură swahili veche (UNESCO)" }, answers: ["Lamu", "Lamu Old Town"], show: { en: "Lamu", ro: "Lamu" } },
    { id: "tea", q: { en: "Leading agricultural export, grown in the highlands", ro: "Principalul export agricol, cultivat în podișuri" }, answers: ["tea", "ceai", "black tea", "chai"], show: { en: "Tea", ro: "Ceaiul" } },
    { id: "1963", q: { en: "Year of independence", ro: "Anul independenței" }, answers: ["1963"], show: { en: "1963", ro: "1963" } },
  ],
}
