/**
 * Hungary: 19 counties + Budapest, keyed by ISO 3166-2 code (= `id` in public/data/maps/hu.json;
 * the 23 cities with county rights in Natural Earth are merged back into their county).
 * Pest county's seat is Budapest, which is also a division of its own.
 */
export const HUNGARY = {
  id: 'hu',
  file: 'hu.json',
  country: "Hungary",
  divisions: [
    { id: 'HU-BK', name: "Bács-Kiskun", seat: "Kecskemét" },
    { id: 'HU-BA', name: "Baranya", seat: "Pécs" },
    { id: 'HU-BE', name: "Békés", seat: "Békéscsaba" },
    { id: 'HU-BZ', name: "Borsod-Abaúj-Zemplén", alt: ["Borsod"], seat: "Miskolc" },
    { id: 'HU-CS', name: "Csongrád-Csanád", alt: ["Csongrád"], seat: "Szeged" },
    { id: 'HU-FE', name: "Fejér", seat: "Székesfehérvár" },
    { id: 'HU-GS', name: "Győr-Moson-Sopron", seat: "Győr" },
    { id: 'HU-HB', name: "Hajdú-Bihar", seat: "Debrecen" },
    { id: 'HU-HE', name: "Heves", seat: "Eger" },
    { id: 'HU-JN', name: "Jász-Nagykun-Szolnok", seat: "Szolnok" },
    { id: 'HU-KE', name: "Komárom-Esztergom", seat: "Tatabánya" },
    { id: 'HU-NO', name: "Nógrád", seat: "Salgótarján" },
    { id: 'HU-PE', name: "Pest", seat: "Budapest" },
    { id: 'HU-SO', name: "Somogy", seat: "Kaposvár" },
    { id: 'HU-SZ', name: "Szabolcs-Szatmár-Bereg", alt: ["Szabolcs"], seat: "Nyíregyháza" },
    { id: 'HU-TO', name: "Tolna", seat: "Szekszárd" },
    { id: 'HU-VA', name: "Vas", seat: "Szombathely" },
    { id: 'HU-VE', name: "Veszprém", seat: "Veszprém" },
    { id: 'HU-ZA', name: "Zala", seat: "Zalaegerszeg" },
    { id: 'HU-BU', name: "Budapest", seat: null, city: true },
  ],
}
