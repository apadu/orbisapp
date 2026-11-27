/**
 * Malaysia: the 13 states and 3 federal territories, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/my.json). Seats = state capitals (the federal territories have none).
 */
export const MALAYSIA = {
  id: 'my',
  file: 'my.json',
  country: "Malaysia",
  divisions: [
    { id: 'MY-01', name: "Johor", alt: ["Johore"], seat: "Johor Bahru", seatAlt: ["Johor Baharu", "JB"] },
    { id: 'MY-02', name: "Kedah", seat: "Alor Setar", seatAlt: ["Alor Star"] },
    { id: 'MY-03', name: "Kelantan", seat: "Kota Bharu", seatAlt: ["Kota Baru"] },
    { id: 'MY-04', name: "Malacca", ro: "Malacca", alt: ["Melaka", "Malaka"], seat: "Malacca City", seatRo: "Malacca", seatAlt: ["Melaka", "Malacca", "Bandaraya Melaka"] },
    { id: 'MY-05', name: "Negeri Sembilan", alt: ["Negri Sembilan"], seat: "Seremban" },
    { id: 'MY-06', name: "Pahang", seat: "Kuantan" },
    { id: 'MY-07', name: "Penang", alt: ["Pulau Pinang", "Pinang"], seat: "George Town", seatAlt: ["Georgetown"] },
    { id: 'MY-08', name: "Perak", seat: "Ipoh" },
    { id: 'MY-09', name: "Perlis", seat: "Kangar" },
    { id: 'MY-10', name: "Selangor", seat: "Shah Alam" },
    { id: 'MY-11', name: "Terengganu", alt: ["Trengganu"], seat: "Kuala Terengganu" },
    { id: 'MY-12', name: "Sabah", seat: "Kota Kinabalu", seatAlt: ["KK"] },
    { id: 'MY-13', name: "Sarawak", seat: "Kuching" },
    { id: 'MY-14', name: "Kuala Lumpur", alt: ["KL"], city: true },
    { id: 'MY-15', name: "Labuan", city: true },
    { id: 'MY-16', name: "Putrajaya", city: true },
  ],
}
