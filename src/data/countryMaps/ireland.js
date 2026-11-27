/**
 * Ireland: the 26 traditional counties of the Republic, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/ie.json; Dublin's 4 councils and the two Tipperarys merged back).
 * Irish names work too. No seats quiz: most county towns share the county's name.
 */
export const IRELAND = {
  id: 'ie',
  file: 'ie.json',
  country: "Ireland",
  divisions: [
    { id: 'IE-CW', name: "Carlow", alt: ["Ceatharlach"] },
    { id: 'IE-CN', name: "Cavan", alt: ["An Cabhán"] },
    { id: 'IE-CE', name: "Clare", alt: ["An Clár"] },
    { id: 'IE-CO', name: "Cork", alt: ["Corcaigh"] },
    { id: 'IE-DL', name: "Donegal", alt: ["Dún na nGall"] },
    { id: 'IE-D', name: "Dublin", alt: ["Baile Átha Cliath", "Dublin City"] },
    { id: 'IE-G', name: "Galway", alt: ["Gaillimh"] },
    { id: 'IE-KY', name: "Kerry", alt: ["Ciarraí"] },
    { id: 'IE-KE', name: "Kildare", alt: ["Cill Dara"] },
    { id: 'IE-KK', name: "Kilkenny", alt: ["Cill Chainnigh"] },
    { id: 'IE-LS', name: "Laois", alt: ["Laoighis", "Leix", "Queen's County"] },
    { id: 'IE-LM', name: "Leitrim", alt: ["Liatroim"] },
    { id: 'IE-LK', name: "Limerick", alt: ["Luimneach"] },
    { id: 'IE-LD', name: "Longford", alt: ["An Longfort"] },
    { id: 'IE-LH', name: "Louth", alt: ["Lú"] },
    { id: 'IE-MO', name: "Mayo", alt: ["Maigh Eo"] },
    { id: 'IE-MH', name: "Meath", alt: ["An Mhí"] },
    { id: 'IE-MN', name: "Monaghan", alt: ["Muineachán"] },
    { id: 'IE-OY', name: "Offaly", alt: ["Uíbh Fhailí"] },
    { id: 'IE-RN', name: "Roscommon", alt: ["Ros Comáin"] },
    { id: 'IE-SO', name: "Sligo", alt: ["Sligeach"] },
    { id: 'IE-TA', name: "Tipperary", alt: ["Tiobraid Árann", "Tipp"] },
    { id: 'IE-WD', name: "Waterford", alt: ["Port Láirge"] },
    { id: 'IE-WH', name: "Westmeath", alt: ["An Iarmhí"] },
    { id: 'IE-WX', name: "Wexford", alt: ["Loch Garman"] },
    { id: 'IE-WW', name: "Wicklow", alt: ["Cill Mhantáin"] },
  ],
}
