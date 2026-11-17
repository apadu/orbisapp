/**
 * Poland: 16 voivodeships, keyed by ISO 3166-2 code (= `id` in public/data/maps/pl.json).
 * `alt` = the Polish name. Two have split capitals (governor / assembly): both accepted.
 */
export const POLAND = {
  id: 'pl',
  file: 'pl.json',
  country: "Poland",
  divisions: [
    { id: 'PL-DS', name: "Lower Silesian", ro: "Silezia Inferioară", alt: ["Dolnośląskie", "Lower Silesia", "Silezia de Jos"], seat: "Wrocław" },
    { id: 'PL-KP', name: "Kuyavian-Pomeranian", ro: "Cuiavia-Pomerania", alt: ["Kujawsko-Pomorskie", "Kuyavia-Pomerania"], seat: "Bydgoszcz", seatAlt: ["Toruń"] },
    { id: 'PL-LU', name: "Lublin", alt: ["Lubelskie"], seat: "Lublin" },
    { id: 'PL-LB', name: "Lubusz", alt: ["Lubuskie"], seat: "Gorzów Wielkopolski", seatAlt: ["Zielona Góra", "Gorzów"] },
    { id: 'PL-LD', name: "Łódź", alt: ["Łódzkie"], seat: "Łódź" },
    { id: 'PL-MA', name: "Lesser Poland", ro: "Polonia Mică", alt: ["Małopolskie", "Malopolska"], seat: "Kraków", seatRo: "Cracovia", seatAlt: ["Cracovia", "Krakow", "Cracow"] },
    { id: 'PL-MZ', name: "Masovian", ro: "Mazovia", alt: ["Mazowieckie", "Masovia"], seat: "Warsaw", seatRo: "Varșovia", seatAlt: ["Varșovia", "Warszawa"] },
    { id: 'PL-OP', name: "Opole", alt: ["Opolskie"], seat: "Opole" },
    { id: 'PL-PK', name: "Subcarpathian", ro: "Subcarpatia", alt: ["Podkarpackie", "Subcarpathia"], seat: "Rzeszów" },
    { id: 'PL-PD', name: "Podlaskie", ro: "Podlasia", alt: ["Podlachian", "Podlachia"], seat: "Białystok" },
    { id: 'PL-PM', name: "Pomeranian", ro: "Pomerania", alt: ["Pomorskie"], seat: "Gdańsk", seatAlt: ["Danzig"] },
    { id: 'PL-SL', name: "Silesian", ro: "Silezia", alt: ["Śląskie", "Silesia"], seat: "Katowice" },
    { id: 'PL-SK', name: "Holy Cross", ro: "Sfânta Cruce", alt: ["Świętokrzyskie", "Swietokrzyskie"], seat: "Kielce" },
    { id: 'PL-WN', name: "Warmian-Masurian", ro: "Varmia-Mazuria", alt: ["Warmińsko-Mazurskie", "Warmia-Masuria"], seat: "Olsztyn" },
    { id: 'PL-WP', name: "Greater Poland", ro: "Polonia Mare", alt: ["Wielkopolskie", "Wielkopolska"], seat: "Poznań" },
    { id: 'PL-ZP', name: "West Pomeranian", ro: "Pomerania Occidentală", alt: ["Zachodniopomorskie", "West Pomerania"], seat: "Szczecin" },
  ],
}
