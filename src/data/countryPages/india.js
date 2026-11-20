/**
 * Country page: India (bilingual inline, like romania.js).
 * Facts: population ≈ 1.46 billion (UN 2025 estimate); area 3,287,263 km²; Kangchenjunga 8,586 m;
 * independence 15 August 1947.
 */
export const INDIA_PAGE = {
  id: 'in',
  flag: '🇮🇳',
  name: { en: 'India', ro: 'India' },
  tagline: {
    en: 'The most populous country on Earth: from the Himalayas to Kerala, 28 states and 8 union territories.',
    ro: 'Cea mai populată țară de pe Pământ: de la Himalaya la Kerala, 28 de state și 8 teritorii unionale.',
  },
  mapHint: { en: 'Hover or tap a state', ro: 'Treci cu mouse-ul sau atinge un stat' },
  seatLabel: { en: 'capital', ro: 'capitala' },
  facts: [
    { icon: '🏛️', label: { en: 'Capital', ro: 'Capitala' }, value: { en: 'New Delhi', ro: 'New Delhi' } },
    { icon: '👥', label: { en: 'Population', ro: 'Populație' }, value: { en: '≈ 1.46 billion (2025)', ro: '≈ 1,46 miliarde (2025)' } },
    { icon: '📐', label: { en: 'Area', ro: 'Suprafață' }, value: { en: '3,287,263 km²', ro: '3.287.263 km²' } },
    { icon: '🗺️', label: { en: 'Divisions', ro: 'Diviziuni' }, value: { en: '28 states + 8 union territories', ro: '28 de state + 8 teritorii unionale' } },
    { icon: '⛰️', label: { en: 'Highest point', ro: 'Cel mai înalt punct' }, value: { en: 'Kangchenjunga, 8,586 m', ro: 'Kangchenjunga, 8.586 m' } },
    { icon: '💶', label: { en: 'Currency', ro: 'Moneda' }, value: { en: 'Indian rupee (INR)', ro: 'Rupia indiană (INR)' } },
    { icon: '🗣️', label: { en: 'Languages', ro: 'Limbi' }, value: { en: 'Hindi and English (+ 22 scheduled languages)', ro: 'Hindi și engleză (+ 22 de limbi recunoscute)' } },
    { icon: '📅', label: { en: 'Independence', ro: 'Independență' }, value: { en: '15 August 1947', ro: '15 august 1947' } },
  ],
  neighbours: { en: 'Pakistan, China, Nepal, Bhutan, Bangladesh and Myanmar', ro: 'Pakistan, China, Nepal, Bhutan, Bangladesh și Myanmar' },
  questions: [
    { id: 'capital', q: { en: 'Capital of India', ro: 'Capitala Indiei' }, answers: ['New Delhi', 'Noua Delhi', 'Delhi'], show: { en: 'New Delhi', ro: 'New Delhi' } },
    { id: 'mumbai', q: { en: 'Largest city, home of Bollywood', ro: 'Cel mai mare oraș, casa Bollywood-ului' }, answers: ['Mumbai', 'Bombay'], show: { en: 'Mumbai', ro: 'Mumbai' } },
    { id: 'agra', q: { en: 'City of the Taj Mahal', ro: 'Orașul în care se află Taj Mahal' }, answers: ['Agra'], show: { en: 'Agra', ro: 'Agra' } },
    { id: 'ganges', q: { en: 'Sacred river of Hinduism', ro: 'Râul sfânt al hinduismului' }, answers: ['Ganges', 'Gange', 'Ganga', 'Gangele'], show: { en: 'Ganges', ro: 'Gange' } },
    { id: 'varanasi', q: { en: 'Holy city on its banks, with the ghats', ro: 'Orașul sfânt de pe malurile lui, cu ghaturile' }, answers: ['Varanasi', 'Benares', 'Banaras', 'Kashi'], show: { en: 'Varanasi', ro: 'Varanasi' } },
    { id: 'kangchenjunga', q: { en: 'Highest peak in India', ro: 'Cel mai înalt vârf din India' }, answers: ['Kangchenjunga', 'Kanchenjunga', 'Kangchendzonga'], show: { en: 'Kangchenjunga', ro: 'Kangchenjunga' } },
    { id: 'himalayas', q: { en: 'Mountain range along the northern border', ro: 'Lanțul muntos de-a lungul graniței de nord' }, answers: ['Himalayas', 'Himalaya', 'Munții Himalaya'], show: { en: 'Himalayas', ro: 'Himalaya' } },
    { id: 'rupee', q: { en: 'Currency', ro: 'Moneda' }, answers: ['rupee', 'rupia', 'rupii', 'rupees', 'INR'], show: { en: 'Rupee', ro: 'Rupia' } },
    { id: '1947', q: { en: 'Year of independence', ro: 'Anul independenței' }, answers: ['1947'], show: { en: '1947', ro: '1947' } },
    { id: 'gandhi', q: { en: 'Leader of the non-violent independence movement', ro: 'Liderul mișcării non-violente pentru independență' }, answers: ['Mahatma Gandhi', 'Gandhi', 'Mohandas Gandhi'], show: { en: 'Mahatma Gandhi', ro: 'Mahatma Gandhi' } },
    { id: 'nehru', q: { en: 'First prime minister', ro: 'Primul prim-ministru' }, answers: ['Jawaharlal Nehru', 'Nehru'], show: { en: 'Jawaharlal Nehru', ro: 'Jawaharlal Nehru' } },
    { id: 'tiger', q: { en: 'National animal', ro: 'Animalul național' }, answers: ['tiger', 'Bengal tiger', 'tigru', 'tigrul bengalez', 'tigru bengalez'], show: { en: 'Bengal tiger', ro: 'Tigrul bengalez' } },
    { id: 'cricket', q: { en: 'Most popular sport', ro: 'Cel mai popular sport' }, answers: ['cricket', 'crichet'], show: { en: 'Cricket', ro: 'Cricket' } },
    { id: 'bengaluru', q: { en: 'Tech hub nicknamed "India\'s Silicon Valley"', ro: 'Centrul IT supranumit „Silicon Valley-ul Indiei”' }, answers: ['Bengaluru', 'Bangalore'], show: { en: 'Bengaluru', ro: 'Bengaluru' } },
    { id: 'diwali', q: { en: 'Festival of lights', ro: 'Festivalul luminilor' }, answers: ['Diwali', 'Deepavali'], show: { en: 'Diwali', ro: 'Diwali' } },
    { id: 'holi', q: { en: 'Festival of colours', ro: 'Festivalul culorilor' }, answers: ['Holi'], show: { en: 'Holi', ro: 'Holi' } },
    { id: 'sri-lanka', q: { en: 'Island country just to the south-east', ro: 'Țara insulară din sud-est, foarte aproape' }, answers: ['Sri Lanka', 'Ceylon', 'Ceilon'], show: { en: 'Sri Lanka', ro: 'Sri Lanka' } },
    { id: 'amritsar', q: { en: 'City of the Golden Temple', ro: 'Orașul Templului de Aur' }, answers: ['Amritsar'], show: { en: 'Amritsar', ro: 'Amritsar' } },
    { id: 'jaipur', q: { en: 'The "Pink City", capital of Rajasthan', ro: '„Orașul Roz”, capitala statului Rajasthan' }, answers: ['Jaipur'], show: { en: 'Jaipur', ro: 'Jaipur' } },
    { id: 'states', q: { en: 'How many states?', ro: 'Câte state are?' }, answers: ['28', 'douăzeci și opt', 'twenty-eight'], show: { en: '28', ro: '28' } },
  ],
}
