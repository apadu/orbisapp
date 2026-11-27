/**
 * Ukraine within its internationally recognised borders: 24 oblasts, the Autonomous Republic of
 * Crimea and the cities of Kyiv and Sevastopol, keyed by ISO 3166-2 code (= `id` in
 * public/data/maps/ua.json). Seats = administrative centres (Kyiv Oblast's is the city of Kyiv).
 */
export const UKRAINE = {
  id: 'ua',
  file: 'ua.json',
  country: "Ukraine",
  divisions: [
    { id: 'UA-05', name: "Vinnytsia", ro: "Vinnița", alt: ["Vinnytsya", "Vinnitsa", "Vinnytsia Oblast"], seat: "Vinnytsia", seatRo: "Vinnița", seatAlt: ["Vinnytsya", "Vinnitsa"] },
    { id: 'UA-07', name: "Volyn", ro: "Volînia", alt: ["Volhynia", "Volinia", "Volyn Oblast"], seat: "Lutsk", seatRo: "Luțk", seatAlt: ["Luck"] },
    { id: 'UA-09', name: "Luhansk", alt: ["Lugansk", "Luhans'k", "Luhansk Oblast"], seat: "Luhansk", seatAlt: ["Lugansk"] },
    { id: 'UA-12', name: "Dnipropetrovsk", alt: ["Dnipropetrovs'k", "Dnepropetrovsk", "Dnipropetrovsk Oblast"], seat: "Dnipro", seatAlt: ["Dnipropetrovsk", "Dnepr", "Nipru"] },
    { id: 'UA-14', name: "Donetsk", ro: "Donețk", alt: ["Donets'k", "Donetsk Oblast"], seat: "Donetsk", seatRo: "Donețk" },
    { id: 'UA-18', name: "Zhytomyr", ro: "Jîtomîr", alt: ["Zhitomir", "Jitomir", "Zhytomyr Oblast"], seat: "Zhytomyr", seatRo: "Jîtomîr", seatAlt: ["Zhitomir", "Jitomir"] },
    { id: 'UA-21', name: "Zakarpattia", ro: "Transcarpatia", alt: ["Transcarpathia", "Zakarpattya", "Zakarpattia Oblast"], seat: "Uzhhorod", seatRo: "Ujhorod", seatAlt: ["Uzhgorod", "Ungvár", "Ujgorod"] },
    { id: 'UA-23', name: "Zaporizhzhia", ro: "Zaporijjea", alt: ["Zaporizhzhya", "Zaporozhye", "Zaporojie", "Zaporizhia"], seat: "Zaporizhzhia", seatRo: "Zaporijjea", seatAlt: ["Zaporozhye", "Zaporojie", "Zaporizhia"] },
    { id: 'UA-26', name: "Ivano-Frankivsk", alt: ["Ivano-Frankivs'k", "Ivano Frankivsk"], seat: "Ivano-Frankivsk", seatAlt: ["Ivano Frankivsk", "Stanislav"] },
    { id: 'UA-30', name: "Kyiv", ro: "Kiev", alt: ["Kiev", "Kyiv City", "Kiev City", "Orașul Kiev"], city: true },
    { id: 'UA-32', name: "Kyiv Oblast", ro: "Regiunea Kiev", alt: ["Kiev Oblast", "Kyiv Region", "Kiev Region", "Kyivska"], seat: "Kyiv", seatRo: "Kiev", seatAlt: ["Kiev"] },
    { id: 'UA-35', name: "Kirovohrad", alt: ["Kirovograd", "Kirovohrad Oblast", "Kropyvnytskyi Oblast"], seat: "Kropyvnytskyi", seatRo: "Kropîvnîțkîi", seatAlt: ["Kropyvnytskyi", "Kropivnitski", "Kropivnițki", "Kropivnitki", "Kirovohrad", "Kirovograd"] },
    { id: 'UA-46', name: "Lviv", ro: "Liov", alt: ["L'viv", "Lvov", "Lwów", "Lwow", "Lemberg"], seat: "Lviv", seatRo: "Liov", seatAlt: ["Lvov", "Lwów", "Lemberg"] },
    { id: 'UA-48', name: "Mykolaiv", ro: "Mîkolaiiv", alt: ["Mykolayiv", "Nikolaev", "Mikolaiv", "Nikolayev"], seat: "Mykolaiv", seatRo: "Mîkolaiiv", seatAlt: ["Mykolayiv", "Nikolaev", "Mikolaiv"] },
    { id: 'UA-51', name: "Odesa", alt: ["Odessa"], seat: "Odesa", seatAlt: ["Odessa"] },
    { id: 'UA-53', name: "Poltava", seat: "Poltava" },
    { id: 'UA-56', name: "Rivne", alt: ["Rovno"], seat: "Rivne", seatAlt: ["Rovno"] },
    { id: 'UA-59', name: "Sumy", ro: "Sumî", alt: ["Sumi"], seat: "Sumy", seatRo: "Sumî", seatAlt: ["Sumi"] },
    { id: 'UA-61', name: "Ternopil", alt: ["Ternopil'", "Ternopol"], seat: "Ternopil", seatAlt: ["Ternopol"] },
    { id: 'UA-63', name: "Kharkiv", ro: "Harkov", alt: ["Kharkov", "Harkiv"], seat: "Kharkiv", seatRo: "Harkov", seatAlt: ["Kharkov", "Harkiv"] },
    { id: 'UA-65', name: "Kherson", ro: "Herson", seat: "Kherson", seatRo: "Herson" },
    { id: 'UA-68', name: "Khmelnytskyi", ro: "Hmelnîțkîi", alt: ["Khmel'nyts'kyy", "Khmelnytsky", "Khmelnitsky", "Hmelnitki"], seat: "Khmelnytskyi", seatRo: "Hmelnîțkîi", seatAlt: ["Khmelnytsky", "Khmelnitsky", "Hmelnitki"] },
    { id: 'UA-71', name: "Cherkasy", ro: "Cerkasî", alt: ["Cherkassy", "Cerkasi"], seat: "Cherkasy", seatRo: "Cerkasî", seatAlt: ["Cherkassy", "Cerkasi"] },
    { id: 'UA-74', name: "Chernihiv", ro: "Cernihiv", alt: ["Chernigov"], seat: "Chernihiv", seatRo: "Cernihiv", seatAlt: ["Chernigov"] },
    { id: 'UA-77', name: "Chernivtsi", ro: "Cernăuți", alt: ["Chernovtsy", "Czernowitz", "Bukovina"], seat: "Chernivtsi", seatRo: "Cernăuți", seatAlt: ["Chernovtsy", "Czernowitz"] },
    { id: 'UA-43', name: "Crimea", ro: "Crimeea", alt: ["Autonomous Republic of Crimea", "Krym", "Republica Autonomă Crimeea"], seat: "Simferopol", seatAlt: ["Simferopol'", "Akmescit"] },
    { id: 'UA-40', name: "Sevastopol", alt: ["Sebastopol"], city: true },
  ],
}
