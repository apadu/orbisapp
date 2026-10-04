/**
 * Endonym quiz data.
 * endonym  – the country name in its own language / script
 * roman    – romanization hint shown below the native script (null if already Latin)
 * language – language the endonym is in
 */
export const ENDONYMS = [
  // ── Europe ────────────────────────────────────────────────────────────────
  { country: 'Germany',         endonym: 'Deutschland',            roman: null,              language: 'German' },
  { country: 'Austria',         endonym: 'Österreich',        roman: null,              language: 'German' },
  { country: 'Switzerland',     endonym: 'Schweiz',                roman: null,              language: 'German' },
  { country: 'Sweden',          endonym: 'Sverige',                roman: null,              language: 'Swedish' },
  { country: 'Norway',          endonym: 'Norge',                  roman: null,              language: 'Norwegian' },
  { country: 'Denmark',         endonym: 'Danmark',                roman: null,              language: 'Danish' },
  { country: 'Finland',         endonym: 'Suomi',                  roman: null,              language: 'Finnish' },
  { country: 'Iceland',         endonym: 'Ísland',            roman: null,              language: 'Icelandic' },
  { country: 'Netherlands',     endonym: 'Nederland',              roman: null,              language: 'Dutch' },
  { country: 'Belgium',         endonym: 'België',            roman: null,              language: 'Dutch' },
  { country: 'Spain',           endonym: 'España',           roman: null,              language: 'Spanish' },
  { country: 'Italy',           endonym: 'Italia',                 roman: null,              language: 'Italian' },
  { country: 'Poland',          endonym: 'Polska',                 roman: null,              language: 'Polish' },
  { country: 'Czech Republic',  endonym: 'Česko',             roman: null,              language: 'Czech' },
  { country: 'Slovakia',        endonym: 'Slovensko',              roman: null,              language: 'Slovak' },
  { country: 'Hungary',         endonym: 'Magyarország',      roman: null,              language: 'Hungarian' },
  { country: 'Croatia',         endonym: 'Hrvatska',               roman: null,              language: 'Croatian' },
  { country: 'Romania',         endonym: 'România',           roman: null,              language: 'Romanian' },
  { country: 'Turkey',          endonym: 'Türkiye',           roman: null,              language: 'Turkish' },
  { country: 'Albania',         endonym: 'Shqipëria',         roman: null,              language: 'Albanian' },
  { country: 'Slovenia',        endonym: 'Slovenija',              roman: null,              language: 'Slovenian' },
  { country: 'Latvia',          endonym: 'Latvija',                roman: null,              language: 'Latvian' },
  { country: 'Lithuania',       endonym: 'Lietuva',                roman: null,              language: 'Lithuanian' },
  { country: 'Estonia',         endonym: 'Eesti',                  roman: null,              language: 'Estonian' },
  { country: 'Ireland',         endonym: 'Éire',              roman: null,              language: 'Irish' },
  { country: 'Greece',          endonym: 'Ελλάδα', roman: 'Elláda', language: 'Greek' },
  { country: 'Bulgaria',        endonym: 'България', roman: 'Balgariya', language: 'Bulgarian' },
  { country: 'Serbia',          endonym: 'Србија', roman: 'Srbija', language: 'Serbian' },
  { country: 'Ukraine',         endonym: 'Україна', roman: 'Ukrayina', language: 'Ukrainian' },
  { country: 'Russia',          endonym: 'Россия', roman: 'Rossiya', language: 'Russian' },
  { country: 'Belarus',         endonym: 'Беларусь', roman: 'Belarus', language: 'Belarusian' },
  { country: 'North Macedonia', endonym: 'Македонија', roman: 'Makedonija', language: 'Macedonian' },
  { country: 'Moldova',         endonym: 'Moldova',                roman: null,              language: 'Romanian' },
  { country: 'Bosnia and Herz.', endonym: 'Bosna i Hercegovina',   roman: null,              language: 'Bosnian' },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { country: 'Japan',           endonym: '日本',           roman: 'Nihon / Nippon',  language: 'Japanese' },
  { country: 'China',           endonym: '中国',           roman: 'Zhōngguó', language: 'Mandarin' },
  { country: 'South Korea',     endonym: '대한민국', roman: 'Daehan Minguk', language: 'Korean' },
  { country: 'North Korea',     endonym: '조선',           roman: 'Joseon',          language: 'Korean' },
  { country: 'Thailand',        endonym: 'ประเทศไทย', roman: 'Prathet Thai', language: 'Thai' },
  { country: 'Myanmar',         endonym: 'မြန်မာ', roman: 'Mranma', language: 'Burmese' },
  { country: 'Cambodia',        endonym: 'កម្ពុជា', roman: 'Kampuchea', language: 'Khmer' },
  { country: 'Georgia',         endonym: 'საქართველო', roman: 'Sakartvelo', language: 'Georgian' },
  { country: 'Armenia',         endonym: 'Հայաստան', roman: 'Hayastan', language: 'Armenian' },
  { country: 'Azerbaijan',      endonym: 'Azərbaycan',        roman: null,              language: 'Azerbaijani' },
  { country: 'Kazakhstan',      endonym: 'Қазақстан', roman: 'Qazaqstan', language: 'Kazakh' },
  { country: 'Mongolia',        endonym: 'Монгол улс', roman: 'Mongol Uls', language: 'Mongolian' },
  { country: 'Vietnam',         endonym: 'Việt Nam',          roman: null,              language: 'Vietnamese' },
  { country: 'India',           endonym: 'भारत', roman: 'Bhārat',  language: 'Hindi' },
  { country: 'Nepal',           endonym: 'नेपाल', roman: 'Nepāl', language: 'Nepali' },
  { country: 'Sri Lanka',       endonym: 'ශ්‍රී ලංකාව', roman: 'Shri Lankava', language: 'Sinhala' },
  { country: 'Philippines',     endonym: 'Pilipinas',              roman: null,              language: 'Filipino' },
  { country: 'Israel',          endonym: 'יִשְׂרָאֵל', roman: 'Yisra\'el', language: 'Hebrew' },
  { country: 'Iran',            endonym: 'ایران', roman: 'Irān', language: 'Persian' },
  { country: 'Iraq',            endonym: 'العراق', roman: 'Al-Iraq', language: 'Arabic' },
  { country: 'Jordan',          endonym: 'الأردن', roman: 'Al-Urdun', language: 'Arabic' },
  { country: 'Lebanon',         endonym: 'لبنان', roman: 'Lubnān', language: 'Arabic' },
  { country: 'Saudi Arabia',    endonym: 'السعودية', roman: 'As-Su\'udiyya', language: 'Arabic' },

  // ── North Africa ──────────────────────────────────────────────────────────
  { country: 'Egypt',           endonym: 'مصر',     roman: 'Misr',            language: 'Arabic' },
  { country: 'Morocco',         endonym: 'المغرب', roman: 'Al-Maghrib', language: 'Arabic' },
  { country: 'Algeria',         endonym: 'الجزائر', roman: 'Al-Jaza\'ir', language: 'Arabic' },
  { country: 'Tunisia',         endonym: 'تونس', roman: 'Tūnis',    language: 'Arabic' },
  { country: 'Libya',           endonym: 'ليبيا', roman: 'Lībiyā', language: 'Arabic' },

  // ── Sub-Saharan Africa ────────────────────────────────────────────────────
  { country: 'Ethiopia',        endonym: 'ኢትዮጵያ', roman: 'Ityop\'ya', language: 'Amharic' },

  // ── Americas ──────────────────────────────────────────────────────────────
  { country: 'Mexico',          endonym: 'México',            roman: null,              language: 'Spanish' },
  { country: 'Brazil',          endonym: 'Brasil',                 roman: null,              language: 'Portuguese' },
  { country: 'Peru',            endonym: 'Perú',              roman: null,              language: 'Spanish' },
]
