/**
 * Slovakia: the 8 regions (kraje), keyed by ISO 3166-2 code (= `id` in public/data/maps/sk.json).
 * No seats quiz: each region is named after its seat.
 */
export const SLOVAKIA = {
  id: 'sk',
  file: 'sk.json',
  country: "Slovakia",
  divisions: [
    { id: 'SK-BL', name: "Bratislava", alt: ["Bratislavský", "Bratislavsky", "Pressburg"] },
    { id: 'SK-TA', name: "Trnava", alt: ["Trnavský", "Trnavsky"] },
    { id: 'SK-TC', name: "Trenčín", alt: ["Trencin", "Trenčiansky", "Trenciansky"] },
    { id: 'SK-NI', name: "Nitra", alt: ["Nitriansky"] },
    { id: 'SK-ZI', name: "Žilina", alt: ["Zilina", "Žilinský", "Zilinsky"] },
    { id: 'SK-BC', name: "Banská Bystrica", alt: ["Banska Bystrica", "Banskobystrický", "Banskobystricky"] },
    { id: 'SK-PV', name: "Prešov", alt: ["Presov", "Prešovský", "Presovsky"] },
    { id: 'SK-KI', name: "Košice", alt: ["Kosice", "Košický", "Kosicky", "Kassa"] },
  ],
}
