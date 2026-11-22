/**
 * South Korea: 17 first-level divisions — 9 provinces, 6 metropolitan cities, the special city
 * of Seoul and the special self-governing city of Sejong — keyed by ISO 3166-2 code
 * (= `id` in public/data/maps/kr.json). `seat` = provincial capital (the cities have none).
 */
export const SOUTH_KOREA = {
  id: 'kr',
  file: 'kr.json',
  country: 'South Korea',
  divisions: [
    { id: 'KR-11', name: 'Seoul', ro: 'Seul', city: true },
    { id: 'KR-26', name: 'Busan', alt: ['Pusan'] },
    { id: 'KR-27', name: 'Daegu', alt: ['Taegu'], city: true },
    { id: 'KR-28', name: 'Incheon', alt: ['Inchon'] },
    { id: 'KR-29', name: 'Gwangju', alt: ['Kwangju'], city: true },
    { id: 'KR-30', name: 'Daejeon', alt: ['Taejon'], city: true },
    { id: 'KR-31', name: 'Ulsan' },
    { id: 'KR-50', name: 'Sejong', city: true },
    { id: 'KR-41', name: 'Gyeonggi', alt: ['Gyeonggi-do', 'Kyonggi'], seat: 'Suwon' },
    { id: 'KR-42', name: 'Gangwon', alt: ['Gangwon-do', 'Kangwon'], seat: 'Chuncheon', seatAlt: ['Chunchon'] },
    { id: 'KR-43', name: 'North Chungcheong', ro: 'Chungcheong de Nord', alt: ['Chungbuk', 'Chungcheongbuk-do', 'Chungcheongbuk'], seat: 'Cheongju', seatAlt: ['Chongju'] },
    { id: 'KR-44', name: 'South Chungcheong', ro: 'Chungcheong de Sud', alt: ['Chungnam', 'Chungcheongnam-do', 'Chungcheongnam'], seat: 'Hongseong', seatAlt: ['Naepo', 'Hongsong'] },
    { id: 'KR-45', name: 'North Jeolla', ro: 'Jeolla de Nord', alt: ['Jeonbuk', 'Jeollabuk-do', 'Jeollabuk', 'Chollabuk'], seat: 'Jeonju', seatAlt: ['Chonju'] },
    { id: 'KR-46', name: 'South Jeolla', ro: 'Jeolla de Sud', alt: ['Jeonnam', 'Jeollanam-do', 'Jeollanam', 'Chollanam'], seat: 'Muan' },
    { id: 'KR-47', name: 'North Gyeongsang', ro: 'Gyeongsang de Nord', alt: ['Gyeongbuk', 'Gyeongsangbuk-do', 'Gyeongsangbuk', 'Kyongsangbuk'], seat: 'Andong' },
    { id: 'KR-48', name: 'South Gyeongsang', ro: 'Gyeongsang de Sud', alt: ['Gyeongnam', 'Gyeongsangnam-do', 'Gyeongsangnam', 'Kyongsangnam'], seat: 'Changwon', seatAlt: ['Changweon'] },
    { id: 'KR-49', name: 'Jeju', alt: ['Jeju-do', 'Cheju'], seat: 'Jeju City', seatAlt: ['Jeju', 'Jeju-si', 'Cheju'] },
  ],
}
