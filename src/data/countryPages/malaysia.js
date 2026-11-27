/**
 * Country page: Malaysia (bilingual inline, like romania.js).
 * Facts: population 32.4 million (2020 census, DOSM); area 330,803 km²; Mount Kinabalu 4,095 m; independence of Malaya 31 August 1957.
 */
export const MALAYSIA_PAGE = {
  id: 'my',
  flag: '🇲🇾',
  name: {"en": "Malaysia", "ro": "Malaezia"},
  tagline: {
    en: "Two halves across the South China Sea: the peninsula and northern Borneo, in 13 states and 3 federal territories.",
    ro: "Două jumătăți despărțite de Marea Chinei de Sud: peninsula și nordul Borneo, în 13 state și 3 teritorii federale.",
  },
  mapHint: { en: "Hover or tap a state", ro: "Treci cu mouse-ul sau atinge un stat" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Kuala Lumpur", ro: "Kuala Lumpur" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "32.4 million (2020 census)", ro: "32,4 milioane (recensământul din 2020)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "330,803 km²", ro: "330.803 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "13 states, 3 federal territories", ro: "13 state, 3 teritorii federale" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Kinabalu, 4,095 m", ro: "Muntele Kinabalu, 4.095 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Malaysian ringgit (MYR)", ro: "Ringgitul malaezian (MYR)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "Malay", ro: "Malaeză" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "31 August 1957 (Malaya)", ro: "31 august 1957 (Malaya)" } },
  ],
  neighbours: { en: "Thailand, Indonesia, Brunei (by land); Singapore across the Johor Strait", ro: "Thailanda, Indonezia, Brunei (pe uscat); Singapore peste strâmtoarea Johor" },
  questions: [
    { id: "capital", q: { en: "Capital of Malaysia", ro: "Capitala Malaeziei" }, answers: ["Kuala Lumpur", "KL"], show: { en: "Kuala Lumpur", ro: "Kuala Lumpur" } },
    { id: "petronas", q: { en: "Twin skyscrapers in the capital, the world's tallest from 1998 to 2004", ro: "Zgârie-norii gemeni din capitală, cei mai înalți din lume între 1998 și 2004" }, answers: ["Petronas Towers", "Petronas", "Petronas Twin Towers", "Turnurile Petronas"], show: { en: "Petronas Towers", ro: "Turnurile Petronas" } },
    { id: "putrajaya", q: { en: "Planned city that is the seat of the federal government", ro: "Orașul planificat care e sediul guvernului federal" }, answers: ["Putrajaya"], show: { en: "Putrajaya", ro: "Putrajaya" } },
    { id: "kinabalu", q: { en: "Highest mountain, in Sabah", ro: "Cel mai înalt munte, în Sabah" }, answers: ["Mount Kinabalu", "Kinabalu", "Muntele Kinabalu"], show: { en: "Mount Kinabalu", ro: "Muntele Kinabalu" } },
    { id: "borneo", q: { en: "Island it shares with Indonesia and Brunei", ro: "Insula pe care o împarte cu Indonezia și Brunei" }, answers: ["Borneo", "Kalimantan"], show: { en: "Borneo", ro: "Borneo" } },
    { id: "ringgit", q: { en: "Currency", ro: "Moneda" }, answers: ["ringgit", "Malaysian ringgit", "ringgit malaezian", "MYR", "RM"], show: { en: "Ringgit", ro: "Ringgit" } },
    { id: "malay", q: { en: "National language", ro: "Limba națională" }, answers: ["Malay", "Bahasa Melayu", "Bahasa Malaysia", "malaeză", "malaeza"], show: { en: "Malay", ro: "Malaeza" } },
    { id: "penang", q: { en: "Island state whose capital, George Town, is on the UNESCO list", ro: "Statul insular a cărui capitală, George Town, e pe lista UNESCO" }, answers: ["Penang", "Pulau Pinang", "Pinang"], show: { en: "Penang", ro: "Penang" } },
    { id: "strait", q: { en: "Busy strait between the peninsula and Sumatra", ro: "Strâmtoarea aglomerată dintre peninsulă și Sumatra" }, answers: ["Strait of Malacca", "Malacca", "Malacca Strait", "Strâmtoarea Malacca", "Melaka"], show: { en: "Strait of Malacca", ro: "Strâmtoarea Malacca" } },
    { id: "malacca", q: { en: "Old trading port, ruled by the Portuguese, Dutch and British", ro: "Vechiul port comercial, condus pe rând de portughezi, olandezi și britanici" }, answers: ["Malacca", "Melaka", "Malacca City"], show: { en: "Malacca (Melaka)", ro: "Malacca (Melaka)" } },
    { id: "kuching", q: { en: "Capital of Sarawak, whose name is linked to the Malay word for \"cat\"", ro: "Capitala statului Sarawak, al cărei nume e legat de cuvântul malaez pentru „pisică”" }, answers: ["Kuching"], show: { en: "Kuching", ro: "Kuching" } },
    { id: "nasilemak", q: { en: "National dish of rice cooked in coconut milk", ro: "Felul național: orez gătit în lapte de cocos" }, answers: ["nasi lemak"], show: { en: "Nasi lemak", ro: "Nasi lemak" } },
    { id: "durian", q: { en: "Spiky \"king of fruits\", famous for its smell", ro: "„Regele fructelor”, țepos și celebru pentru miros" }, answers: ["durian"], show: { en: "Durian", ro: "Durian" } },
    { id: "orangutan", q: { en: "Red-haired great ape of the Borneo rainforest", ro: "Maimuța mare cu păr roșcat din pădurile din Borneo" }, answers: ["orangutan", "orang-utan", "orangutanul", "urangutan"], show: { en: "Orangutan", ro: "Orangutan" } },
    { id: "palmoil", q: { en: "Plantation crop of which it is the world's second-largest producer", ro: "Cultura de plantație la care e al doilea producător mondial" }, answers: ["palm oil", "oil palm", "ulei de palmier", "palmier", "palm"], show: { en: "Palm oil", ro: "Uleiul de palmier" } },
    { id: "langkawi", q: { en: "Archipelago of 99 islands off the north-west coast", ro: "Arhipelagul de 99 de insule din largul coastei de nord-vest" }, answers: ["Langkawi"], show: { en: "Langkawi", ro: "Langkawi" } },
    { id: "cameron", q: { en: "Hill station famous for tea plantations", ro: "Stațiunea montană celebră pentru plantațiile de ceai" }, answers: ["Cameron Highlands", "Cameron"], show: { en: "Cameron Highlands", ro: "Cameron Highlands" } },
    { id: "singapore", q: { en: "City that left the federation in 1965", ro: "Orașul care a părăsit federația în 1965" }, answers: ["Singapore", "Singapur"], show: { en: "Singapore", ro: "Singapore" } },
    { id: "sepang", q: { en: "Circuit near Kuala Lumpur that hosted Formula 1 from 1999 to 2017", ro: "Circuitul de lângă Kuala Lumpur care a găzduit Formula 1 între 1999 și 2017" }, answers: ["Sepang", "Sepang International Circuit"], show: { en: "Sepang", ro: "Sepang" } },
    { id: "1957", q: { en: "Year Malaya became independent", ro: "Anul în care Malaya a devenit independentă" }, answers: ["1957"], show: { en: "1957", ro: "1957" } },
  ],
}
