/**
 * Saudi Arabia: the 13 regions (provinces), keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/sa.json). Seats = regional capitals.
 */
export const SAUDI_ARABIA = {
  id: 'sa',
  file: 'sa.json',
  country: "Saudi Arabia",
  divisions: [
    { id: 'SA-01', name: "Riyadh", ro: "Riad", alt: ["Ar Riyad", "Ar-Riyad", "Riyadh Province", "Riyadh Region"], seat: "Riyadh", seatRo: "Riad", seatAlt: ["Ar Riyad"] },
    { id: 'SA-02', name: "Mecca", alt: ["Makkah", "Makkah Province", "Mecca Province", "Makkah al-Mukarramah"], seat: "Mecca", seatAlt: ["Makkah"] },
    { id: 'SA-03', name: "Medina", alt: ["Al Madinah", "Al-Madinah", "Madinah", "Medina Province"], seat: "Medina", seatAlt: ["Madinah", "Al Madinah"] },
    { id: 'SA-04', name: "Eastern Province", ro: "Provincia de Est", alt: ["Ash Sharqiyah", "Ash-Sharqiyah", "Sharqiyah", "Eastern"], seat: "Dammam", seatAlt: ["Ad Dammam"] },
    { id: 'SA-05', name: "Al-Qassim", alt: ["Qassim", "Al Qassim", "Al Quassim", "Al Qasim", "Qasim"], seat: "Buraydah", seatAlt: ["Buraidah", "Buraida", "Burayda"] },
    { id: 'SA-06', name: "Ha'il", alt: ["Hail", "Hayil", "Hail Province"], seat: "Ha'il", seatAlt: ["Hail", "Hayil"] },
    { id: 'SA-07', name: "Tabuk", alt: ["Tabouk"], seat: "Tabuk", seatAlt: ["Tabouk"] },
    { id: 'SA-08', name: "Northern Borders", ro: "Granițele de Nord", alt: ["Al Hudud ash Shamaliyah", "Northern Frontier", "Northern Borders Province"], seat: "Arar", seatAlt: ["'Ar'ar", "Ar'ar"] },
    { id: 'SA-09', name: "Jazan", alt: ["Jizan", "Gizan", "Jazan Province"], seat: "Jazan", seatAlt: ["Jizan", "Gizan"] },
    { id: 'SA-10', name: "Najran", alt: ["Nejran"], seat: "Najran", seatAlt: ["Nejran"] },
    { id: 'SA-11', name: "Al-Bahah", alt: ["Al Bahah", "Bahah", "Baha", "Al Baha"], seat: "Al-Bahah", seatAlt: ["Al Bahah", "Baha", "Al Baha"] },
    { id: 'SA-12', name: "Al-Jawf", alt: ["Al Jawf", "Jawf", "Al-Jouf", "Jouf"], seat: "Sakakah", seatAlt: ["Sakaka"] },
    { id: 'SA-14', name: "Asir", alt: ["'Asir", "Aseer", "Assir"], seat: "Abha" },
  ],
}
