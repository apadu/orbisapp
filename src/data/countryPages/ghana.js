/**
 * Country page: Ghana (bilingual inline, like romania.js).
 * Facts: population 30.8 million (2021 census, GSS); area 238,535 km²; Mount Afadja (Afadjato) 885 m; independence 6 March 1957.
 */
export const GHANA_PAGE = {
  id: 'gh',
  flag: '🇬🇭',
  name: {"en": "Ghana", "ro": "Ghana"},
  tagline: {
    en: "The old Gold Coast: cocoa, castles and Lake Volta, in 16 regions on the Gulf of Guinea.",
    ro: "Fosta Coastă de Aur: cacao, castele și Lacul Volta, în 16 regiuni la Golful Guineei.",
  },
  mapHint: { en: "Hover or tap a region", ro: "Treci cu mouse-ul sau atinge o regiune" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Accra", ro: "Accra" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "30.8 million (2021 census)", ro: "30,8 milioane (recensământul din 2021)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "238,535 km²", ro: "238.535 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "16 regions", ro: "16 regiuni" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Mount Afadja, 885 m", ro: "Muntele Afadja, 885 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Ghanaian cedi (GHS)", ro: "Cedi ghanez (GHS)" } },
    { icon: '🗣️', label: { en: "Language", ro: "Limba" }, value: { en: "English (and many local languages)", ro: "Engleză (și multe limbi locale)" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "6 March 1957", ro: "6 martie 1957" } },
  ],
  neighbours: { en: "Côte d'Ivoire, Burkina Faso, Togo", ro: "Coasta de Fildeș, Burkina Faso, Togo" },
  questions: [
    { id: "capital", q: { en: "Capital of Ghana", ro: "Capitala statului Ghana" }, answers: ["Accra"], show: { en: "Accra", ro: "Accra" } },
    { id: "goldcoast", q: { en: "Colonial name of the country", ro: "Numele colonial al țării" }, answers: ["Gold Coast", "Coasta de Aur", "The Gold Coast"], show: { en: "Gold Coast", ro: "Coasta de Aur" } },
    { id: "nkrumah", q: { en: "Independence leader and first president", ro: "Liderul independenței și primul președinte" }, answers: ["Kwame Nkrumah", "Nkrumah"], show: { en: "Kwame Nkrumah", ro: "Kwame Nkrumah" } },
    { id: "1957", q: { en: "Year it became the first sub-Saharan colony to win independence", ro: "Anul în care a devenit prima colonie subsahariană independentă" }, answers: ["1957"], show: { en: "1957", ro: "1957" } },
    { id: "volta", q: { en: "Huge artificial lake behind the Akosombo Dam", ro: "Uriașul lac artificial din spatele barajului Akosombo" }, answers: ["Lake Volta", "Volta", "Lacul Volta"], show: { en: "Lake Volta", ro: "Lacul Volta" } },
    { id: "kumasi", q: { en: "Second city, capital of the Ashanti Region", ro: "Al doilea oraș, capitala regiunii Ashanti" }, answers: ["Kumasi"], show: { en: "Kumasi", ro: "Kumasi" } },
    { id: "cocoa", q: { en: "Crop of which it is the world's second-largest producer", ro: "Cultura la care e al doilea producător mondial" }, answers: ["cocoa", "cacao", "cocoa beans", "cacao beans", "boabe de cacao"], show: { en: "Cocoa", ro: "Cacao" } },
    { id: "cedi", q: { en: "Currency", ro: "Moneda" }, answers: ["cedi", "Ghanaian cedi", "GHS"], show: { en: "Cedi", ro: "Cedi" } },
    { id: "kente", q: { en: "Colourful woven cloth of the Asante and Ewe", ro: "Țesătura colorată a populațiilor ashanti și ewe" }, answers: ["kente", "kente cloth"], show: { en: "Kente", ro: "Kente" } },
    { id: "annan", q: { en: "Ghanaian who was UN Secretary-General (1997–2006)", ro: "Ghanezul care a fost secretar general al ONU (1997–2006)" }, answers: ["Kofi Annan", "Annan"], show: { en: "Kofi Annan", ro: "Kofi Annan" } },
    { id: "akosombo", q: { en: "Dam that created Lake Volta", ro: "Barajul care a creat Lacul Volta" }, answers: ["Akosombo", "Akosombo Dam"], show: { en: "Akosombo Dam", ro: "Barajul Akosombo" } },
    { id: "elmina", q: { en: "Coastal castle built by the Portuguese in 1482", ro: "Castelul de pe coastă construit de portughezi în 1482" }, answers: ["Elmina", "Elmina Castle", "São Jorge da Mina", "Sao Jorge da Mina"], show: { en: "Elmina Castle", ro: "Castelul Elmina" } },
    { id: "afadja", q: { en: "Highest mountain", ro: "Cel mai înalt munte" }, answers: ["Afadja", "Afadjato", "Mount Afadja", "Mount Afadjato", "Muntele Afadja"], show: { en: "Mount Afadja (Afadjato)", ro: "Muntele Afadja (Afadjato)" } },
    { id: "asante", q: { en: "Kingdom whose sacred symbol is the Golden Stool", ro: "Regatul al cărui simbol sacru e Scaunul de Aur" }, answers: ["Ashanti", "Asante", "Ashanti Empire", "Asante Kingdom"], show: { en: "Ashanti (Asante)", ro: "Ashanti (Asante)" } },
    { id: "fufu", q: { en: "Dough of pounded cassava and plantain, eaten with soup", ro: "Pasta din manioc și banane plantain pisate, mâncată cu supă" }, answers: ["fufu", "foofoo", "fufuo"], show: { en: "Fufu", ro: "Fufu" } },
    { id: "tamale", q: { en: "Largest city of the north", ro: "Cel mai mare oraș din nord" }, answers: ["Tamale"], show: { en: "Tamale", ro: "Tamale" } },
    { id: "mole", q: { en: "Largest national park, known for elephants", ro: "Cel mai mare parc național, cunoscut pentru elefanți" }, answers: ["Mole", "Mole National Park"], show: { en: "Mole National Park", ro: "Parcul Național Mole" } },
    { id: "kakum", q: { en: "Rainforest park with a canopy walkway", ro: "Parcul de pădure tropicală cu pasarelă printre coroane" }, answers: ["Kakum", "Kakum National Park"], show: { en: "Kakum", ro: "Kakum" } },
    { id: "guinea", q: { en: "Gulf on its coast", ro: "Golful de pe coasta sa" }, answers: ["Gulf of Guinea", "Guinea", "Golful Guineei"], show: { en: "Gulf of Guinea", ro: "Golful Guineei" } },
    { id: "meridian", q: { en: "Line of longitude that passes near Tema", ro: "Meridianul care trece pe lângă Tema" }, answers: ["Prime Meridian", "Greenwich Meridian", "Greenwich", "meridianul zero", "meridianul Greenwich", "meridian zero"], show: { en: "Prime Meridian", ro: "Meridianul zero" } },
  ],
}
