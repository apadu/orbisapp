/**
 * China: the 31 provincial-level divisions of the mainland — 22 provinces, 5 autonomous
 * regions and 4 municipalities — keyed by ISO 3166-2 code (= `id` in public/data/maps/cn.json).
 * `seat` = provincial capital (the municipalities have none).
 */
export const CHINA = {
  id: 'cn',
  file: 'cn.json',
  country: 'China',
  divisions: [
    { id: 'CN-AH', name: 'Anhui', seat: 'Hefei' },
    { id: 'CN-BJ', name: 'Beijing', ro: 'Beijing', alt: ['Peking', 'Pekin'], city: true },
    { id: 'CN-CQ', name: 'Chongqing', city: true },
    { id: 'CN-FJ', name: 'Fujian', seat: 'Fuzhou' },
    { id: 'CN-GS', name: 'Gansu', seat: 'Lanzhou' },
    { id: 'CN-GD', name: 'Guangdong', seat: 'Guangzhou', seatAlt: ['Canton'] },
    { id: 'CN-GX', name: 'Guangxi', seat: 'Nanning' },
    { id: 'CN-GZ', name: 'Guizhou', seat: 'Guiyang' },
    { id: 'CN-HI', name: 'Hainan', seat: 'Haikou' },
    { id: 'CN-HE', name: 'Hebei', seat: 'Shijiazhuang' },
    { id: 'CN-HL', name: 'Heilongjiang', seat: 'Harbin' },
    { id: 'CN-HA', name: 'Henan', seat: 'Zhengzhou' },
    { id: 'CN-HB', name: 'Hubei', seat: 'Wuhan' },
    { id: 'CN-HN', name: 'Hunan', seat: 'Changsha' },
    { id: 'CN-NM', name: 'Inner Mongolia', ro: 'Mongolia Interioară', alt: ['Nei Mongol'], seat: 'Hohhot' },
    { id: 'CN-JS', name: 'Jiangsu', seat: 'Nanjing', seatAlt: ['Nanking'] },
    { id: 'CN-JX', name: 'Jiangxi', seat: 'Nanchang' },
    { id: 'CN-JL', name: 'Jilin', seat: 'Changchun' },
    { id: 'CN-LN', name: 'Liaoning', seat: 'Shenyang' },
    { id: 'CN-NX', name: 'Ningxia', seat: 'Yinchuan' },
    { id: 'CN-QH', name: 'Qinghai', seat: 'Xining' },
    { id: 'CN-SN', name: 'Shaanxi', seat: "Xi'an", seatAlt: ['Xian'] },
    { id: 'CN-SD', name: 'Shandong', seat: 'Jinan' },
    { id: 'CN-SH', name: 'Shanghai', city: true },
    { id: 'CN-SX', name: 'Shanxi', seat: 'Taiyuan' },
    { id: 'CN-SC', name: 'Sichuan', seat: 'Chengdu' },
    { id: 'CN-TJ', name: 'Tianjin', city: true },
    { id: 'CN-XZ', name: 'Tibet', ro: 'Tibet', alt: ['Xizang'], seat: 'Lhasa' },
    { id: 'CN-XJ', name: 'Xinjiang', seat: 'Ürümqi', seatAlt: ['Urumqi'] },
    { id: 'CN-YN', name: 'Yunnan', seat: 'Kunming' },
    { id: 'CN-ZJ', name: 'Zhejiang', seat: 'Hangzhou' },
  ],
}
