import { useEffect, useMemo, useRef, useState } from 'react'
import { loadResults, subscribeResults } from '../utils/results'
import DailyBanner from './DailyBanner'
import { GAME_CATALOG } from '../utils/gameCatalog'
import { t, locale } from '../i18n'
import { gameTag, isNewGame, addedOn } from '../utils/gameTags'
import GameIcon from './GameIcon'
import Icon from './Icon'
import { TRIPOINT_QUIZZES } from '../quizzes/tripointQuizzes'
import { useQuizOverview, rankScore } from '../utils/quizOverview'
import StateNote from './StateNote'

// ── Catalogue ──────────────────────────────────────────────────────────────
/** Families of categories: how the category tabs are grouped */
export const QUIZ_FAMILIES = [
  { id: 'countries', label: t('Countries') },
  { id: 'nature',    label: t('Maps & nature') },
  { id: 'games',     label: t('Games') },
]
export const QUIZ_CATEGORIES = [
  { id: 'flags',    family: 'countries', label: t('Flags & symbols'), icon: '🚩', color: '#D98C7A' },
  { id: 'capitals', family: 'countries', label: t('Capitals'),        icon: '🏛️', color: '#5FB7A8' },
  { id: 'culture',  family: 'countries', label: t('Culture & facts'), icon: '📖', color: '#D9C49A' },
  { id: 'lists',    family: 'countries', label: t('Lists & groups'),  icon: '📋', color: '#8CC18F' },
  { id: 'numbers',  family: 'countries', label: t('Size & numbers'),  icon: '📊', color: '#6FA8DC' },
  { id: 'words',    family: 'countries', label: t('Names & spelling'), icon: '🔤', color: '#E2B65C' },
  { id: 'history',  family: 'countries', label: t('World history'),         icon: '🏺', color: '#C9A27A' },
  { id: 'maps',     family: 'nature',    label: t('Maps'),            icon: '🗺️', color: '#7FB0C9' },
  { id: 'science',  family: 'nature',    label: t('Earth science'),   icon: '🌋', color: '#E0915C' },
  { id: 'space',    family: 'nature',    label: t('Space'),           icon: '🪐', color: '#9C8CE0' },
  { id: 'puzzles',  family: 'games',     label: t('Puzzles'),         icon: '🧩', color: '#9BB3CF' },
  { id: 'arcade',   family: 'games',     label: t('Arcade'),          icon: '🕹️', color: '#FF7A3D' },
]

export const QUIZ_ITEMS = [
  { id: 'flag',           cat: 'flags',    icon: '🚩', label: t('Flag Fever'),                desc: t('Name 20 or 30 random flags. Watch out: Chad and Romania are near twins.') },
  { id: 'flag-colors',    cat: 'flags',    icon: '🎨', label: t('Flag Colors'),          desc: t('No shapes, no symbols — just the colour mix. Whose flag is it?') },
  { id: 'capital',        cat: 'capitals', icon: '🏛️', label: t('Capital Fever'),             desc: t('196 capitals. Australia\'s isn\'t Sydney, Canada\'s isn\'t Toronto.') },
  { id: 'capitals-europe', cat: 'capitals', icon: '🏰', label: t('Capitals of Europe'), desc: t("From Lisbon to Moscow \u2014 the capitals of every European country.") },
  { id: 'capitals-asia', cat: 'capitals', icon: '🏯', label: t('Capitals of Asia'), desc: t("From Ankara to Tokyo \u2014 and Naypyidaw, not Yangon.") },
  { id: 'capitals-africa', cat: 'capitals', icon: '🦁', label: t('Capitals of Africa'), desc: t("54 countries, from Rabat to Pretoria \u2014 and Abuja, not Lagos.") },
  { id: 'capitals-americas', cat: 'capitals', icon: '🗽', label: t('Capitals of the Americas'), desc: t("From Ottawa to Buenos Aires \u2014 Bras\u00edlia, not Rio.") },
  { id: 'capitals-oceania', cat: 'capitals', icon: '🌊', label: t('Capitals of Oceania'), desc: t("Canberra, Wellington and the Pacific islands.") },
  { id: 'cap-to-country', cat: 'capitals', icon: '🗺️', label: t('Countries by Capital'), desc: t('Ouagadougou, Thimphu, Vaduz… which country does each one belong to?') },
  { id: 'scramble',       cat: 'words',    icon: '🔀', label: t('Scramble'),             desc: t('RAMONIA is Romania. Can you untangle 30 more country names?') },
  { id: 'missing-vowels', cat: 'words',    icon: '🔡', label: t('Missing Vowels'),       desc: t('MXC is Mexico, BRZL is Brazil. Only the consonants are left.') },
  { id: 'endonyms',       cat: 'words',    icon: '🔠', label: t('Endonyms'),             desc: t('Suomi, Sverige, Deutschland — countries by the names they call themselves.') },
  { id: 'country-fact',   cat: 'culture',  icon: '📖', label: t('Country by Fact'),      desc: t('More kangaroos than people? 62 surprising facts, one country each.') },
  { id: 'currency',       cat: 'culture',  icon: '💰', label: t('Currencies'),           desc: t('Lek, kwacha, ngultrum… name the money of every country.') },
  { id: 'language',       cat: 'culture',  icon: '🗣️', label: t('Languages'),            desc: t('Dari, Catalan, Dzongkha… name each country\'s main language.') },
  { id: 'pop-order',      cat: 'numbers',  icon: '📊', label: t('Most Populous Countries'),        desc: t('The top 30 by population. Ranks and head counts are your only clues.') },
  { id: 'area',           cat: 'numbers',  icon: '📏', label: t('Largest Countries'),    desc: t('The 30 largest countries. Algeria is #10 — bigger than Saudi Arabia.') },
  { id: 'flags-crescent', cat: 'flags', icon: '☪️', label: t('Flags with a Crescent'), desc: t('13 flags with a crescent, from Algeria to Singapore.') },
  { id: 'flags-cross', cat: 'flags', icon: '✝️', label: t('Flags with a Cross'), desc: t('13 flags with a cross — and not all of them are in Europe.') },
  { id: 'flags-sun', cat: 'flags', icon: '☀️', label: t('Flags with a Sun'), desc: t('12 flags with a sun. Argentina\'s and Uruguay\'s even have faces.') },
  { id: 'landlocked', cat: 'lists', icon: '🏔️', label: t('Landlocked Countries'), desc: t('45 countries with no coastline. Two are surrounded only by others like them.') },
  { id: 'island-nations', cat: 'lists', icon: '🏝️', label: t('Island Nations'), desc: t('45 countries made only of islands. Indonesia alone has 17,000+.') },
  { id: 'eu-members', cat: 'lists', icon: '🇪🇺', label: t('EU Members'), desc: t('All 27 EU members. Croatia, the newest, joined in 2013.') },
  { id: 'nato-members', cat: 'lists', icon: '🛡️', label: t('NATO Members'), desc: t('All 32 NATO members. Sweden became number 32 in 2024.') },
  { id: 'g20', cat: 'lists', icon: '💼', label: t('G20 Countries'), desc: t('19 countries plus the EU and the African Union. Name the 19.') },
  { id: 'former-ussr', cat: 'history', icon: '☭', label: t('Former Soviet Republics'), desc: t('15 republics, one union. Russia was just the biggest piece.') },
  { id: 'former-yugoslavia', cat: 'history', icon: '🧩', label: t('Former Yugoslavia'), desc: t('One country in 1990, seven today. Name them all.') },
  { id: 'equator', cat: 'lists', icon: '🌐', label: t('On the Equator'), desc: t('The Equator crosses 13 countries — only one is named after it.') },
  { id: 'stans', cat: 'lists', icon: '🐎', label: t('The -stans'), desc: t('Seven -stans. In Persian, "stan" means "land of".') },
  { id: 'spanish-speaking', cat: 'lists', icon: '🇪🇸', label: t('Spanish-speaking'), desc: t('Spanish is official in 20 countries — one of them is in Africa.') },
  { id: 'portuguese-speaking', cat: 'lists', icon: '🇵🇹', label: t('Portuguese-speaking'), desc: t('Portuguese is official in 9 countries on 4 continents.') },
  { id: 'french-speaking', cat: 'lists', icon: '🇫🇷', label: t('French-speaking'), desc: t('French is official in 29 countries. Most of them are in Africa.') },
  { id: 'alphabet', cat: 'lists', icon: '🔤', label: t('A to Z'), desc: t('One country per letter. Q has only one option.') },
  { id: 'ww1', cat: 'history', icon: '🪖', label: t('World War I Countries'), desc: t('28 nations under their 1914–18 names: Hejaz, Siam, Austria-Hungary…') },
  { id: 'ww2', cat: 'history', icon: '✈️', label: t('World War II Countries'), desc: t('34 belligerents. Some, like Italy and Romania, switched sides.') },
  { id: 'former-names', cat: 'history', icon: '📜', label: t('Former Country Names'), desc: t('Ceylon, Persia, Upper Volta… 39 old names. What are they called today?') },
  { id: 'monarchies', cat: 'lists', icon: '👑', label: t('Monarchies Today'), desc: t('43 countries still have a monarch — 15 of them share the same king.') },
  { id: 'drive-left', cat: 'lists', icon: '🚗', label: t('Countries Driving on the Left'), desc: t('54 countries keep left. It\'s not just Britain and its former colonies.') },
  { id: 'named-after', cat: 'culture', icon: '👤', label: t('Countries Named After People'), desc: t('Columbus, Bolívar, King Philip II… 21 countries named after a person.') },
  { id: 'euro-users', cat: 'culture', icon: '💶', label: t('Countries Using the Euro'), desc: t('27 countries use the euro — including some outside the EU.') },
  { id: 'dollar-users', cat: 'culture', icon: '💵', label: t('Countries Using a Dollar'), desc: t('34 countries pay in dollars — some their own, some America\'s.') },
  { id: 'english-speaking', cat: 'lists', icon: '🇬🇧', label: t('English-speaking'), desc: t('English is official or main in 60 countries, from Fiji to Sierra Leone.') },
  { id: 'arabic-speaking', cat: 'lists', icon: '🕌', label: t('Arabic-speaking'), desc: t('25 countries, from Mauritania on the Atlantic to Oman on the Arabian Sea.') },
  { id: 'capital-same-name', cat: 'capitals', icon: '🪞', label: t('Capital Namesakes'), desc: t('Kuwait → Kuwait City, Panama → Panama City. 14 countries like that.') },
  { id: 'capitals-a-z', cat: 'capitals', icon: '🔠', label: t('Capitals A to Z'), desc: t('One capital per letter. For Q, there\'s only Quito.') },
  { id: 'caribbean', cat: 'lists', icon: '🌴', label: t('Caribbean Countries'), desc: t('13 island countries, from Cuba down to tiny Saint Kitts and Nevis.') },
  { id: 'central-america', cat: 'lists', icon: '🌋', label: t('Central America'), desc: t('7 countries between Mexico and Colombia. Only Belize has English as official.') },
  { id: 'nordic', cat: 'lists', icon: '❄️', label: t('Nordic Countries'), desc: t('5 Nordic countries — but only 3 of them are Scandinavian.') },
  { id: 'gulf-states', cat: 'lists', icon: '🛢️', label: t('Gulf States'), desc: t('6 Gulf Cooperation Council members. Iraq and Iran aren\'t among them.') },
  { id: 'smallest', cat: 'numbers', icon: '🔬', label: t('Smallest Countries'), desc: t('The 20 smallest. Vatican City could fit into Central Park 7 times.') },
  { id: 'least-populous', cat: 'numbers', icon: '🧍', label: t('Least Populous'), desc: t('The 20 tiniest populations. Tuvalu has about 11,000 people.') },
  { id: 'higher-lower',   cat: 'arcade',   icon: '⚖️', label: t('Higher or Lower'),      desc: t('More people? Bigger? One wrong call ends the streak.') },
  { id: 'flags-pick',     cat: 'flags',    icon: '🎯', label: t('Pick the Flag'),        desc: t('A country name and four flags — pick the right one. 20 rounds.') },
  { id: 'flags-sprint',   cat: 'flags',    icon: '⚡', label: t('Fever Sprint'),          desc: t('One flag at a time — name as many as you can before the clock runs out.') },
  { id: 'flags-survival', cat: 'flags',    icon: '❤️', label: t('Flag Survival'),        desc: t('Three lives. Name each flag from four choices — how far can you go?') },
  { id: 'true-false',     cat: 'arcade',   icon: '✅', label: t('True or False'),        desc: t('Rapid-fire facts. True or false — every mistake costs 3 seconds.') },
  { id: 'country-wordle', cat: 'puzzles',  icon: '🟩', label: t('Country Wordle'),       desc: t('One country a day, six tries, and colour clues for every letter.') },
  { id: 'connections',    cat: 'puzzles',  icon: '🧩', label: t('Country Connections'),          desc: t('16 countries, 4 hidden links. "One away!" means you\'re close.') },
  { id: 'border-chain',   cat: 'puzzles',  icon: '🔗', label: t('Border Chain'),         desc: t('Cross the map neighbour by neighbour. Can you match the shortest path?') },
  { id: 'islands',        cat: 'maps',     icon: '🏝️', label: t('Famous Islands'),       desc: t('30 famous islands lit up on the world map, from Greenland to Mallorca.') },
  { id: 'lakes', cat: 'maps', icon: '💧', label: t('Famous Lakes'), desc: t("27 lakes, from the Caspian Sea to Balaton.") },
  { id: 'deserts', cat: 'maps', icon: '🏜️', label: t('Famous Deserts'), desc: t("From the Sahara to the Gobi and the Atacama.") },
  { id: 'seas-map', cat: 'maps', icon: '🌊', label: t('Seas and Gulfs'), desc: t("28 seas and gulfs, from the Baltic to the Coral Sea.") },
  { id: 'straits', cat: 'maps', icon: '⚓', label: t('Famous Straits'), desc: t("Gibraltar, the Bosphorus, Hormuz, Magellan \u2014 20 straits and channels.") },
  { id: 'earth-layers', cat: 'science', icon: '🌍', label: t('Layers of the Earth'), desc: t("From the inner core to the exosphere \u2014 16 layers and boundaries on a globe cut in half.") },
  { id: 'plates', cat: 'science', icon: '🧩', label: t('Tectonic Plates'), desc: t("18 plates on the world map, from the giant Pacific to tiny Juan de Fuca.") },
  { id: 'rocks', cat: 'science', icon: '🪨', label: t('Rock Types'), desc: t("Granite, marble, chalk\u2026 name 17 rocks from their description.") },
  { id: 'rock-cycle', cat: 'science', icon: '🔄', label: t('The Rock Cycle'), desc: t("Magma, sediments, metamorphism \u2014 complete the cycle of rocks.") },
  { id: 'volcanoes', cat: 'science', icon: '🌋', label: t("Famous Volcanoes"), desc: t("Etna, Fuji, Krakatoa, Kilimanjaro \u2014 22 volcanoes and the Ring of Fire.") },
  { id: 'volcano', cat: 'science', icon: '🌋', label: t("Anatomy of a Volcano"), desc: t("Magma chamber, vent, crater, ash cloud \u2014 10 parts of a volcano cut in half.") },
  { id: 'plate-boundaries', cat: 'science', icon: '↔️', label: t("Plate Boundaries"), desc: t("Divergent, subduction, collision, transform \u2014 and the trenches, ridges and mountains they make.") },
  { id: 'ocean-floor', cat: 'science', icon: '🌊', label: t("Trenches and Ridges"), desc: t("The Mariana Trench, the Mid-Atlantic Ridge, the East African Rift \u2014 13 lines on the map.") },
  { id: 'water-cycle', cat: 'science', icon: '💧', label: t("The Water Cycle"), desc: t("Evaporation, condensation, precipitation, infiltration \u2014 9 stages of water's journey.") },
  { id: 'currents', cat: 'science', icon: '🌀', label: t("Ocean Currents"), desc: t("The Gulf Stream, Kuroshio, Humboldt \u2014 14 warm and cold currents.") },
  { id: 'climate-zones', cat: 'science', icon: '🌡️', label: t("Climate Zones"), desc: t("Torrid, temperate and frigid zones, the tropics, the polar circles and the poles.") },
  { id: 'earth-lines', cat: 'science', icon: '🧭', label: t("Imaginary Lines"), desc: t("The Equator, the tropics, the Arctic Circle, Greenwich and the Date Line on the map.") },
  { id: 'earth-orbit', cat: 'space', icon: '☀️', label: t("The Earth in Space"), desc: t("Solstices, equinoxes, perihelion, aphelion \u2014 why we have seasons.") },
  { id: 'landscape', cat: 'science', icon: '⛰️', label: t("Landforms"), desc: t("Fjord, delta, atoll, canyon, plateau \u2014 17 landforms in one landscape.") },
  { id: 'biomes', cat: 'science', icon: '🌳', label: t("Biomes"), desc: t("Taiga, savanna, tundra, steppe \u2014 14 biomes from their description.") },
  { id: 'minerals', cat: 'science', icon: '💎', label: t("Minerals"), desc: t("From talc to diamond: the Mohs scale and 9 more famous minerals.") },
  { id: 'phenomena', cat: 'science', icon: '🌪️', label: t("Natural Phenomena"), desc: t("Tsunami, foehn, El Ni\u00f1o, aurora \u2014 18 phenomena from their description.") },
  { id: 'earth-records', cat: 'science', icon: '🏆', label: t("Records of the Earth"), desc: t("The highest, deepest, driest, coldest \u2014 23 records, one place each.") },
  { id: 'geologic-time', cat: 'science', icon: '🦕', label: t("Geological Time"), desc: t("From the Precambrian to the Quaternary \u2014 the 13 chapters of Earth's history.") },
  { id: 'solar-system', cat: 'space', icon: '🪐', label: t("The Solar System"), desc: t("The Sun, 8 planets, the Moon, Pluto and the two belts \u2014 13 in all.") },
  { id: 'planets', cat: 'space', icon: '🪐', label: t("Planets by Clues"), desc: t("Hottest, windiest, tipped on its side \u2014 13 bodies of the Solar System from a clue.") },
  { id: 'moon-phases', cat: 'space', icon: '🌓', label: t("Phases of the Moon"), desc: t("New moon, first quarter, waxing gibbous\u2026 all 8 phases and why they happen.") },
  { id: 'eclipses', cat: 'space', icon: '🌑', label: t("Eclipses"), desc: t("Solar and lunar eclipses: umbra, penumbra, corona and the blood moon.") },
  { id: 'sun-anatomy', cat: 'space', icon: '☀️', label: t("Inside the Sun"), desc: t("Core, radiative and convective zones, sunspots, prominences, solar wind.") },
  { id: 'moons', cat: 'space', icon: '🌙', label: t("Moons of the Solar System"), desc: t("Titan, Europa, Io, Triton, Charon \u2014 15 moons and the worlds they orbit.") },
  { id: 'sky-map', cat: 'space', icon: '🌌', label: t("The Night Sky"), desc: t("Ursa Major, Orion, Cassiopeia, the Milky Way \u2014 24 things to find in the sky over Romania.") },
  { id: 'stars-constellations', cat: 'space', icon: '✨', label: t("Stars and Constellations"), desc: t("Sirius, Polaris, Betelgeuse, the Pleiades \u2014 20 stars, constellations and galaxies.") },
  { id: 'missions', cat: 'space', icon: '🚀', label: t("Space Exploration"), desc: t("From Sputnik and Gagarin to Dumitru Prunariu and James Webb \u2014 21 missions in order.") },
  { id: 'phys-europe', cat: 'maps', icon: '🏔️', label: t("Physical Map of Europe"), desc: t("The Danube, the Alps, the Carpathians, the Urals \u2014 20 rivers, ranges and plains.") },
  { id: 'phys-asia', cat: 'maps', icon: '🏔️', label: t("Physical Map of Asia"), desc: t("The Himalayas, the Yangtze, the Tibetan Plateau \u2014 23 rivers, ranges and plains.") },
  { id: 'phys-africa', cat: 'maps', icon: '🏔️', label: t("Physical Map of Africa"), desc: t("The Nile, the Atlas, the Rift Valley, the Sahel \u2014 16 rivers, ranges and plains.") },
  { id: 'phys-namerica', cat: 'maps', icon: '🏔️', label: t("Physical Map of North America"), desc: t("The Rockies, the Mississippi, the Great Plains \u2014 18 rivers, ranges and plains.") },
  { id: 'phys-samerica', cat: 'maps', icon: '🏔️', label: t("Physical Map of South America"), desc: t("The Andes, the Amazon, the Pampas \u2014 17 rivers, ranges and plains.") },
  { id: 'phys-oceania', cat: 'maps', icon: '🏔️', label: t("Physical Map of Oceania"), desc: t("The Great Dividing Range, Uluru, the Murray \u2014 13 places in Australia and New Zealand.") },
  { id: 'rivers-world', cat: 'maps', icon: '🏞️', label: t("Great Rivers of the World"), desc: t("The Nile, the Amazon, the Yangtze, the Danube \u2014 25 rivers drawn on the map.") },
  { id: 'wonders-ancient', cat: 'maps', icon: '🏛️', label: t("Seven Wonders of the Ancient World"), desc: t("The pyramids, the Colossus, the Lighthouse of Alexandria \u2014 where they stood.") },
  { id: 'wonders-new', cat: 'maps', icon: '🗿', label: t("New Seven Wonders"), desc: t("The Great Wall, Petra, Machu Picchu, the Taj Mahal \u2014 and the pyramids of Giza.") },
  { id: 'cities-world', cat: 'maps', icon: '🏙️', label: t("Great Cities of the World"), desc: t("Tokyo, Lagos, Lima, Sydney \u2014 34 big cities marked on the world map.") },
  { id: 'cities-europe', cat: 'maps', icon: '🏰', label: t("Cities of Europe"), desc: t("From Lisbon to Moscow \u2014 33 European cities on the map.") },
  { id: 'cities-romania', cat: 'maps', icon: '🇷🇴', label: t("Cities of Romania"), desc: t("Bucure\u0219ti, Cluj, Timi\u0219oara, Ia\u0219i \u2014 30 Romanian cities on the map.") },
  { id: 'hist-100', cat: 'history', icon: '🏛️', label: t("The World in AD 100"), desc: t("Rome, the Han, the Parthians \u2014 and Dacia, just before Trajan. 16 states.") },
  { id: 'hist-1279', cat: 'history', icon: '🐎', label: t("The Mongol Empire, 1279"), desc: t("The four Mongol khanates and their neighbours, at the empire's peak. 16 states.") },
  { id: 'hist-1700', cat: 'history', icon: '👑', label: t("The World in 1700"), desc: t("Ottomans, Mughals, Qing, Spain and Russia \u2014 16 great powers.") },
  { id: 'hist-1914', cat: 'history', icon: '🗺️', label: t("Colonial Empires in 1914"), desc: t("The British, French, German and Russian empires \u2014 and 12 more, on the eve of WWI.") },
  { id: 'flags-historical', cat: 'history', icon: '🏴', label: t('Historical Flags'), desc: t('The USSR, Yugoslavia, Zaire, the 1989 flag with a hole — 18 flags that are gone.') },
  { id: 'peaks', cat: 'maps', icon: '🏔️', label: t("Famous Peaks"), desc: t("Everest, K2, Aconcagua, Denali, Mont Blanc \u2014 23 summits on the world map.") },
  { id: 'waterfalls', cat: 'maps', icon: '💦', label: t("Famous Waterfalls"), desc: t("Angel, Iguaz\u00fa, Niagara, Victoria \u2014 19 waterfalls around the world.") },
  { id: 'natural-wonders', cat: 'maps', icon: '🏞️', label: t("Natural Wonders"), desc: t("The Grand Canyon, Ha Long Bay, Uluru, Gal\u00e1pagos \u2014 26 places on the map.") },
  { id: 'extreme-points', cat: 'maps', icon: '🧭', label: t("Extreme Points of the Continents"), desc: t("Cape Horn, North Cape, Cape Agulhas \u2014 the ends of every continent.") },
  { id: 'clouds', cat: 'science', icon: '☁️', label: t("Types of Clouds"), desc: t("Cirrus, cumulus, nimbostratus, cumulonimbus \u2014 11 clouds by shape and height.") },
  { id: 'climates', cat: 'science', icon: '🌦️', label: t("Climate Types"), desc: t("Equatorial, Mediterranean, monsoon, tundra \u2014 13 climates and where to find them.") },
  { id: 'scales', cat: 'science', icon: '📐', label: t("Scales and Units"), desc: t("Richter, Beaufort, Mohs, Kelvin, light-years \u2014 18 ways to measure the planet.") },
  { id: 'river-coast', cat: 'science', icon: '🏞️', label: t("Rivers and Coasts"), desc: t("Source, tributary, oxbow lake, estuary, lagoon, sea arch \u2014 15 parts of rivers and coasts.") },
  { id: 'atmosphere', cat: 'science', icon: '🛰️', label: t("What's Up There? The Atmosphere"), desc: t("From Everest and airliners to auroras, the ISS and GPS satellites \u2014 13 things in the sky.") },
  { id: 'volcano-types', cat: 'science', icon: '🌋', label: t("Kinds of Volcanoes"), desc: t("Shield, stratovolcano, cinder cone, caldera, geyser \u2014 8 kinds of volcanoes.") },
  { id: 'milky-way', cat: 'space', icon: '🌀', label: t("Our Galaxy, the Milky Way"), desc: t("The spiral arms, the black hole at the centre and the Sun \u2014 12 parts of our galaxy.") },
  { id: 'star-life', cat: 'space', icon: '⭐', label: t("The Life of a Star"), desc: t("Nebula, red giant, supernova, black hole \u2014 11 stages from birth to death.") },
  { id: 'moon-map', cat: 'space', icon: '🌕', label: t("Map of the Moon"), desc: t("The Sea of Tranquillity, the Ocean of Storms, Tycho, Apollo 11 \u2014 13 places on the Moon.") },
  { id: 'mars-map', cat: 'space', icon: '🔴', label: t("Map of Mars"), desc: t("Olympus Mons, Valles Marineris, the ice caps and the rovers \u2014 12 places on Mars.") },
  { id: 'bright-stars', cat: 'space', icon: '🌟', label: t("The Brightest Stars"), desc: t("Sirius, Canopus, Arcturus, Vega \u2014 the 21 brightest stars of the night sky.") },
  { id: 'zodiac', cat: 'space', icon: '♈', label: t("Constellations of the Zodiac"), desc: t("Aries to Pisces \u2014 and Ophiuchus, the 13th the Sun passes through.") },
  { id: 'glaciers', cat: 'maps', icon: '🧊', label: t("Glaciers and Ice Caps"), desc: t("Vatnaj\u00f6kull, Aletsch, Perito Moreno, Kilimanjaro \u2014 15 glaciers on the world map.") },
  { id: 'records-map', cat: 'maps', icon: '🏆', label: t("Record-Breaking Places"), desc: t("The hottest, the wettest, the deepest, the most remote \u2014 20 record holders on the map.") },
  { id: 'scale-sort', cat: 'science', icon: '📏', label: t("The Scale of Things"), desc: t("From a proton to the whole universe: put five things in order of size, round after round.") },
  { id: 'peninsulas',     cat: 'maps',     icon: '🗺️', label: t('Famous Peninsulas'),    desc: t('21 famous peninsulas lit up on the world map, from Iberia to Kamchatka.') },
  ...Object.values(TRIPOINT_QUIZZES).map(q => ({
    id: q.id, cat: 'puzzles', icon: '⨯', label: q.title,
    desc: q.num === 1 ? t('Three countries meet at one point. Zoomed-in maps, 10 points per quiz — name all three.') : t('10 more points where three countries meet.'),
  })),
]


/**
 * Quizzes that belong together are shown as one card that opens to its parts — numbered series
 * (Tripoints #1, #2…) and themed sets (flags with symbols, countries by language…).
 * Each group sits in its members' category, where its first member would be.
 */
export const QUIZ_GROUPS = [
  { id: 'grp-capitals-continents', label: t('Capitals by continent'), desc: t('Europe, Asia, Africa, the Americas and Oceania — one quiz each.'),
    members: ['capitals-europe', 'capitals-asia', 'capitals-africa', 'capitals-americas', 'capitals-oceania'] },
  { id: 'grp-flag-symbols', label: t('Flags with symbols'), desc: t('Crescents, crosses and suns — three flag hunts.'),
    members: ['flags-crescent', 'flags-cross', 'flags-sun'] },
  { id: 'grp-wars', label: t('World Wars'), desc: t('Every country that fought, under its name at the time.'),
    members: ['ww1', 'ww2'] },
  { id: 'grp-shared-money', label: t('Shared currencies'), desc: t('Who pays in euros? Who uses the US dollar without being the US?'),
    members: ['euro-users', 'dollar-users'] },
  { id: 'grp-languages', label: t('Countries by language'), desc: t('Where English, Spanish, French, Portuguese and Arabic are official.'),
    members: ['english-speaking', 'spanish-speaking', 'french-speaking', 'portuguese-speaking', 'arabic-speaking'] },
  { id: 'grp-orgs', label: t('Organisations'), desc: t('EU, NATO and G20 members.'),
    members: ['eu-members', 'nato-members', 'g20'] },
  { id: 'grp-former', label: t('Countries that broke up'), desc: t('The Soviet Union and Yugoslavia, piece by piece.'),
    members: ['former-ussr', 'former-yugoslavia'] },
  { id: 'grp-regions', label: t('Regions'), desc: t('The Caribbean, Central America, the Nordics, the Gulf and the -stans.'),
    members: ['caribbean', 'central-america', 'nordic', 'gulf-states', 'stans'] },
  { id: 'grp-world-landforms', label: t('Islands, peninsulas, deserts'), desc: t('The famous ones, lit up on the world map.'),
    members: ['islands', 'peninsulas', 'deserts'] },
  { id: 'grp-world-waters', label: t('Lakes, seas and rivers'), desc: t('Lakes, seas and gulfs, straits and the great rivers of the world.'),
    members: ['lakes', 'seas-map', 'straits', 'rivers-world'] },
  { id: 'grp-phys-continents', label: t('Physical maps by continent'), desc: t('Rivers, mountains and plains — one map for each continent.'),
    members: ['phys-europe', 'phys-asia', 'phys-africa', 'phys-namerica', 'phys-samerica', 'phys-oceania'] },
  { id: 'grp-wonders', label: t('Wonders of the World'), desc: t('The seven ancient wonders and the New Seven Wonders.'),
    members: ['wonders-ancient', 'wonders-new'] },
  { id: 'grp-cities', label: t('Cities on the map'), desc: t('The great cities of the world, of Europe and of Romania.'),
    members: ['cities-world', 'cities-europe', 'cities-romania'] },
  { id: 'grp-empires', label: t('Empires through time'), desc: t('The world in AD 100, 1279, 1700 and 1914 — name the empires on the map.'),
    members: ['hist-100', 'hist-1279', 'hist-1700', 'hist-1914'] },
  { id: 'grp-nature-wonders', label: t('Peaks, glaciers and natural wonders'), desc: t('Famous summits, waterfalls, glaciers, natural wonders, extreme points and record-breaking places.'),
    members: ['peaks', 'waterfalls', 'glaciers', 'natural-wonders', 'extreme-points', 'records-map'] },
  { id: 'grp-earth-inside', label: t('Inside the Earth'), desc: t('Layers, tectonic plates, plate boundaries, trenches and ridges.'),
    members: ['earth-layers', 'plates', 'plate-boundaries', 'ocean-floor'] },
  { id: 'grp-volcanoes', label: t('Volcanoes'), desc: t('Famous volcanoes on the map, the anatomy of a volcano and its kinds.'),
    members: ['volcanoes', 'volcano', 'volcano-types'] },
  { id: 'grp-rocks', label: t('Rocks and minerals'), desc: t('Rock types, the rock cycle and the Mohs scale.'),
    members: ['rocks', 'rock-cycle', 'minerals'] },
  { id: 'grp-water-climate', label: t('Water, air and climate'), desc: t('The water cycle, rivers and coasts, clouds, the atmosphere, ocean currents, climates and the imaginary lines.'),
    members: ['water-cycle', 'river-coast', 'clouds', 'atmosphere', 'currents', 'climate-zones', 'climates', 'earth-lines'] },
  { id: 'grp-planets', label: t('Planets and moons'), desc: t('The Solar System, planets by clues and the moons that orbit them.'),
    members: ['solar-system', 'planets', 'moons'] },
  { id: 'grp-sun-moon', label: t('Sun, Earth and Moon'), desc: t('Seasons, the phases of the Moon, eclipses and the inside of the Sun.'),
    members: ['earth-orbit', 'moon-phases', 'eclipses', 'sun-anatomy'] },
  { id: 'grp-sky', label: t('Stars and the night sky'), desc: t('The night sky, the brightest stars, the zodiac, constellations and galaxies.'),
    members: ['sky-map', 'bright-stars', 'zodiac', 'stars-constellations'] },
  { id: 'grp-deep-space', label: t('Stars and galaxies'), desc: t('How stars are born and die, and the shape of our galaxy.'),
    members: ['star-life', 'milky-way'] },
  { id: 'grp-other-worlds', label: t('Maps of other worlds'), desc: t('The seas and craters of the Moon, the volcanoes and canyons of Mars.'),
    members: ['moon-map', 'mars-map'] },
  { id: 'grp-tripoints', label: t('Tripoints'), desc: t('Three countries meet at one point. Zoomed-in maps, 10 points per quiz — name all three.'),
    members: Object.keys(TRIPOINT_QUIZZES), numbered: true },
].map(g => {
  const members = g.members.map(id => QUIZ_ITEMS.find(q => q.id === id)).filter(Boolean)
  return { ...g, members, cat: members[0]?.cat }
}).filter(g => g.members.length > 1)

const GROUP_OF = Object.fromEntries(QUIZ_GROUPS.flatMap(g => g.members.map(m => [m.id, g])))
const CAP = 4   // cards per category on the "All" view

/** A category's cards: single quizzes, plus one card per group (where its first member sits). */
function entriesFor(catId) {
  const out = [], seen = new Set()
  for (const it of QUIZ_ITEMS) {
    if (it.cat !== catId) continue
    const g = GROUP_OF[it.id]
    if (!g) out.push({ type: 'quiz', item: it })
    else if (!seen.has(g.id)) { seen.add(g.id); out.push({ type: 'group', group: g }) }
  }
  return out
}

// Medal = best accuracy in a "real" session (finished, or at least 10 answers)
const MEDALS = [
  { min: 0.9,  icon: '🥇', label: t('Gold'),   cls: 'gold' },
  { min: 0.75, icon: '🥈', label: t('Silver'), cls: 'silver' },
  { min: 0.5,  icon: '🥉', label: t('Bronze'), cls: 'bronze' },
]

// ── Stats from saved results ───────────────────────────────────────────────
function sessionAccuracy(r) {
  // Connections always ends 4/4 — judge it by mistakes instead
  if (r.mode === 'connections') return r.completed ? 4 / (4 + (r.details?.mistakes ?? 0)) : 0
  if (r.mode === 'higher-lower') return Math.min(1, r.score / 20)       // 20 in a row = gold
  if (r.mode === 'country-wordle') return r.correct ? Math.min(1, (r.score + 2) / 6) : 0
  return r.total ? r.correct / r.total : 0
}

export function summarize(results) {
  const by = {}
  for (const r of results) {
    const m = by[r.mode] ?? (by[r.mode] = { plays: 0, correct: 0, total: 0, best: 0, bestCorrect: 0, bestTotal: 0, bestAcc: 0, last: null })
    m.plays++
    m.correct += r.correct
    m.total   += r.total
    m.best = Math.max(m.best, r.score)
    // "Best round" = most correct answers (ties → fewer questions)
    if (r.correct > m.bestCorrect || (r.correct === m.bestCorrect && r.correct > 0 && r.total < m.bestTotal)) {
      m.bestCorrect = r.correct; m.bestTotal = r.total
    }
    if (!m.last || r.played_at > m.last) m.last = r.played_at
    if (!r.details?.untimed && (r.completed || r.total >= 10)) m.bestAcc = Math.max(m.bestAcc, sessionAccuracy(r))
  }
  for (const m of Object.values(by)) m.medal = MEDALS.find(x => m.bestAcc >= x.min) ?? null
  return by
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000
  if (s < 3600) return t('just now')
  if (s < 86400) return t('{v}h ago', { v: Math.floor(s / 3600) })
  if (s < 2 * 86400) return t('yesterday')
  if (s < 30 * 86400) return t('{v}d ago', { v: Math.floor(s / 86400) })
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// ── Component ──────────────────────────────────────────────────────────────
export default function QuizHub({ onSelect, countryNames = [] }) {
  const [results, setResults] = useState(loadResults)
  useEffect(() => subscribeResults(() => setResults(loadResults())), [])
  const stats = useMemo(() => summarize(results), [results])

  const [query,  setQuery]  = useState('')
  const filter = 'all'
  const [cat,    setCat]    = useState(() => { try { return sessionStorage.getItem('orbis-qh-cat') ?? 'all' } catch { return 'all' } })
  const [openGroup, setOpenGroup] = useState(null)
  const [sort, setSort] = useState('default')   // default | rated | popular
  const overview = useQuizOverview()
  const hasRatings = Object.values(overview).some(o => o.ratings > 0)
  const hasPlays = Object.values(overview).some(o => o.playsWeek > 0)
  const chooseCat = (c) => { setCat(c); setOpenGroup(null); try { sessionStorage.setItem('orbis-qh-cat', c) } catch { /* private mode */ } }
  // cat is 'all', a family ('fam:countries') or one category ('capitals')
  const catFamily = cat.startsWith('fam:') ? cat.slice(4) : QUIZ_CATEGORIES.find(c => c.id === cat)?.family ?? null
  const showsCat = (catId) => cat === 'all' || cat === catId || cat === `fam:${QUIZ_CATEGORIES.find(c => c.id === catId)?.family}`
  const catLabel = cat === 'all' ? t('All') : cat.startsWith('fam:') ? QUIZ_FAMILIES.find(f => f.id === catFamily)?.label : QUIZ_CATEGORIES.find(c => c.id === cat)?.label
  const searchRef = useRef(null)

  // "/" focuses search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visible = useMemo(() => {
    const q = norm(query.trim())
    return QUIZ_ITEMS.filter(it => {
      if (filter === 'unplayed' && stats[it.id]) return false
      if (q && !norm(`${it.label} ${it.desc}`).includes(q)) return false
      return true
    })
  }, [query, filter, stats])

  // Continue: most recent quiz-hub game
  const lastQuiz = useMemo(() => {
    const quizIds = new Set(QUIZ_ITEMS.map(q => q.id))
    const r = results.find(x => quizIds.has(x.mode))
    return r ? { item: QUIZ_ITEMS.find(q => q.id === r.mode), result: r } : null
  }, [results])

  // Newest first; same day → catalogue order
  const newest = useMemo(() => QUIZ_ITEMS
    .map((it, i) => ({ it, i, d: addedOn(it.id) }))
    .filter(x => x.d && isNewGame(x.it.id) && !stats[x.it.id])
    .sort((a, b) => b.d.localeCompare(a.d) || a.i - b.i)
    .slice(0, 16)
    .map(x => x.it), [stats])
  const filtering = query.trim() !== '' || filter !== 'all'

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && visible.length === 1) onSelect(visible[0].id)
    if (e.key === 'Escape') { setQuery(''); e.currentTarget.blur() }
  }

  return (
    <div className="qh">
      {/* ── Header ── */}
      <header className="qh-head">
        <h1 className="qh-title">{t('Quiz Hub')}</h1>
      </header>

      {/* ── Daily quiz ── */}
      {!filtering && <DailyBanner countryNames={countryNames} onOpen={() => onSelect('daily-quiz')} />}

      {/* ── Continue banner ── */}
      {!filtering && (
        lastQuiz ? (
          <button className="qh-continue" onClick={() => onSelect(lastQuiz.item.id)}
            style={{ '--cat': QUIZ_CATEGORIES.find(c => c.id === lastQuiz.item.cat).color }}>
            <span className="qh-continue-icon"><GameIcon id={lastQuiz.item.id} size={28} /></span>
            <span className="qh-continue-body">
              <span className="qh-continue-kicker">{t('Continue playing')}</span>
              <span className="qh-continue-name">{lastQuiz.item.label}</span>
              <span className="qh-continue-meta">
                {t('Last round')} {lastQuiz.result.correct}/{lastQuiz.result.total} {t('correct ·')} {timeAgo(lastQuiz.result.played_at)}
              </span>
            </span>
            <span className="qh-continue-cta">{t('Play ▸')}</span>
          </button>
        ) : (
          <button className="qh-continue" onClick={() => onSelect('flag')} style={{ '--cat': QUIZ_CATEGORIES[0].color }}>
            <span className="qh-continue-icon"><GameIcon id="flag" size={28} /></span>
            <span className="qh-continue-body">
              <span className="qh-continue-kicker">{t('New here?')}</span>
              <span className="qh-continue-name">{t('Start with the Flags Quiz')}</span>
              <span className="qh-continue-meta">{t('The easiest warm-up — then work your way to Endonyms')}</span>
            </span>
            <span className="qh-continue-cta">{t('Play ▸')}</span>
          </button>
        )
      )}

      {/* ── Toolbar ── */}
      <div className="qh-toolbar">
        <label className="qh-search">
          <Icon name="search" size={17} />
          <input
            ref={searchRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onSearchKey}
            placeholder={t('Search quizzes…')}
            aria-label={t('Search quizzes')}
          />
          {query ? <button className="qh-search-clear" onClick={() => setQuery('')} aria-label={t('Clear')}>✕</button> : <kbd>/</kbd>}
        </label>
        <div className="qh-chips">
          {/* one toggle; the category tabs below have their own "All" */}
          {hasRatings && (
            <button className={`qh-chip${sort === 'rated' ? ' active' : ''}`} aria-pressed={sort === 'rated'} onClick={() => setSort(v => (v === 'rated' ? 'default' : 'rated'))}>
              ★ {t('Top rated')}
            </button>
          )}
          {hasPlays && (
            <button className={`qh-chip${sort === 'popular' ? ' active' : ''}`} aria-pressed={sort === 'popular'} onClick={() => setSort(v => (v === 'popular' ? 'default' : 'popular'))}>
              {t('Popular this week')}
            </button>
          )}
        </div>
      </div>

      {/* ── Families (big tabs), then the categories of the chosen family ── */}
      <div className="qh-fams" role="tablist" aria-label={t('Categories')}>
        {[{ id: 'all', label: t('All') }, ...QUIZ_FAMILIES].map(f => {
          const active = f.id === 'all' ? cat === 'all' : catFamily === f.id
          const n = f.id === 'all' ? QUIZ_ITEMS.length : QUIZ_ITEMS.filter(q => QUIZ_CATEGORIES.find(c => c.id === q.cat)?.family === f.id).length
          return (
            <button key={f.id} role="tab" aria-selected={active} className={`qh-fam${active ? ' active' : ''}`}
              onClick={() => chooseCat(f.id === 'all' ? 'all' : `fam:${f.id}`)}>
              <span className="qh-fam-label">{f.label}</span>
              <span className="qh-fam-n">{n}</span>
            </button>
          )
        })}
      </div>
      {catFamily && (
        <div className="qh-cats" role="tablist" aria-label={QUIZ_FAMILIES.find(f => f.id === catFamily)?.label}>
          <button role="tab" aria-selected={cat === `fam:${catFamily}`} className={`qh-cat${cat === `fam:${catFamily}` ? ' active' : ''}`} onClick={() => chooseCat(`fam:${catFamily}`)}>
            {t('All')}
          </button>
          {QUIZ_CATEGORIES.filter(c => c.family === catFamily).map(c => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={`qh-cat${cat === c.id ? ' active' : ''}`} onClick={() => chooseCat(c.id)}
              style={{ '--cat': c.color }}>
              <span className="qh-cat-dot" aria-hidden="true" />
              {c.label}
              <span className="qh-cat-n">{QUIZ_ITEMS.filter(q => q.cat === c.id).length}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── New quizzes: a strip of the latest ones you haven't played ── */}
      {!filtering && cat === 'all' && sort === 'default' && newest.length > 0 && (
        <section className="qh-new">
          <div className="qh-section-head">
            <span className="qh-section-icon">✨</span>
            <h2>{t('New quizzes')}</h2>
            <span className="qh-section-count">{newest.length}</span>
          </div>
          <div className="qh-new-strip">
            {newest.map(it => (
              <button key={it.id} className="qh-new-card" onClick={() => onSelect(it.id)} style={{ '--cat': QUIZ_CATEGORIES.find(c => c.id === it.cat)?.color }}>
                <span className="qh-new-icon"><GameIcon id={it.id} size={22} /></span>
                <span className="qh-new-body">
                  <span className="qh-new-name">{it.label}</span>
                  <span className="qh-new-cat">{QUIZ_CATEGORIES.find(c => c.id === it.cat)?.label}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Category rows (or one sorted list) ── */}
      {sort !== 'default' && visible.length > 0 ? (
        <section className="qh-section">
          <div className="qh-section-head">
            <h2>{sort === 'rated' ? t('Top rated') : t('Popular this week')}</h2>
            <span className="qh-section-count">{catLabel}</span>
          </div>
          <div className="qh-grid">
            {visible
              .filter(it => showsCat(it.cat))
              .map((it, i) => ({ it, i, key: sort === 'rated' ? rankScore(overview[it.id]) : (overview[it.id]?.playsWeek ?? 0) }))
              .sort((a, b) => b.key - a.key || a.i - b.i)
              .map(({ it }) => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onSelect} rating={overview[it.id]} />)}
          </div>
        </section>
      ) : visible.length === 0 ? (
        <StateNote action={{ label: t('Clear filters'), onClick: () => setQuery('') }}>{t('No quizzes match.')}</StateNote>
      ) : QUIZ_CATEGORIES.filter(c => showsCat(c.id)).map(c => {
        const catAll = QUIZ_ITEMS.filter(it => it.cat === c.id)
        // Searching / "not played": every matching quiz, ungrouped
        const entries = filtering
          ? visible.filter(it => it.cat === c.id).map(item => ({ type: 'quiz', item }))
          : entriesFor(c.id)
        if (!entries.length) return null
        const capped = !filtering && !QUIZ_CATEGORIES.some(x => x.id === cat) && entries.length > CAP
        const shown = capped ? entries.slice(0, CAP) : entries
        const open = shown.find(e => e.type === 'group' && e.group.id === openGroup)?.group
        return (
          <section key={c.id} className="qh-section" style={{ '--cat': c.color }}>
            <div className="qh-section-head">
              <span className="qh-section-icon"><GameIcon id={QUIZ_ITEMS.find(q => q.cat === c.id)?.id} size={18} /></span>
              <h2>{c.label}</h2>
              <span className="qh-section-count">{catAll.length}</span>
              {capped && <button className="qh-see-all" onClick={() => chooseCat(c.id)}>{t('See all ({n})', { n: entries.length })} ›</button>}
            </div>
            <div className="qh-grid">
              {shown.map(e => e.type === 'quiz'
                ? <QuizTile key={e.item.id} item={e.item} st={stats[e.item.id]} onSelect={onSelect} rating={overview[e.item.id]} />
                : <QuizGroupTile key={e.group.id} group={e.group} stats={stats} open={openGroup === e.group.id}
                    onToggle={() => setOpenGroup(o => (o === e.group.id ? null : e.group.id))} />)}
            </div>
            {open && <GroupPanel group={open} stats={stats} onSelect={onSelect} onClose={() => setOpenGroup(null)} />}
          </section>
        )
      })}
    </div>
  )
}

export function QuizTile({ item, st, onSelect, rating = null }) {
  const fresh = !st && isNewGame(item.id)
  return (
    <button className={`qh-tile${fresh ? ' qh-tile-new' : ''}`} onClick={() => onSelect(item.id)}>
      <span className="qh-tile-top">
        <span className="qh-tile-icon"><GameIcon id={item.id} size={26} /></span>
        {rating?.ratings > 0 ? <span className="qh-tile-rating" title={t(rating.ratings === 1 ? '{r} average · 1 rating' : '{r} average · {n} ratings', { r: rating.rating.toLocaleString(locale), n: rating.ratings })}>★ {rating.rating.toLocaleString(locale, { maximumFractionDigits: 1 })}</span>
          : fresh && <span className="qh-tile-new-badge">{t('New')}</span>}
      </span>
      <span className="qh-tile-name">{item.label}</span>
      <span className="qh-tile-foot">
        <span className="qh-tile-tag" title={gameTag(item.id)}>{gameTag(item.id, { short: !!st })}</span>
        {st ? (
          <span className="qh-tile-stats" title={t('{plays} game{v} · last {v2}', { plays: st.plays, v: st.plays === 1 ? '' : 's', v2: timeAgo(st.last) })}>
            {GAME_CATALOG[item.id]?.unit
              ? <>🏆 {st.best} {GAME_CATALOG[item.id].unit.toLowerCase()} · {st.plays}×</>
              : <>🏆 {st.bestCorrect}/{st.bestTotal} · {st.total ? Math.round((st.correct / st.total) * 100) : 0}%</>}
          </span>
        ) : (
          <span className="qh-tile-play">{t('Play ▸')}</span>
        )}
      </span>
    </button>
  )
}

/** One card for a set of quizzes; opens the GroupPanel. */
function QuizGroupTile({ group, stats, open, onToggle }) {
  const ids = group.members.map(m => m.id)
  const played = ids.filter(id => stats[id]).length
  const fresh = !played && ids.some(id => isNewGame(id))
  return (
    <button className={`qh-tile qh-group${open ? ' open' : ''}${fresh ? ' qh-tile-new' : ''}`} onClick={onToggle} aria-expanded={open}>
      <span className="qh-tile-top">
        <span className="qh-tile-icon"><GameIcon id={ids[0]} size={26} /></span>
        {fresh && <span className="qh-tile-new-badge">{t('New')}</span>}
      </span>
      <span className="qh-tile-name">{group.label}</span>
      <span className="qh-tile-foot">
        <span className="qh-tile-tag">{t('{n} quizzes', { n: ids.length })}</span>
        <span className="qh-tile-play">{open ? t('Close ▴') : t('Open ▾')}</span>
      </span>
    </button>
  )
}

/** The parts of an open group: numbered buttons for a series, quiz cards for a themed set. */
function GroupPanel({ group, stats, onSelect, onClose }) {
  return (
    <div className="qh-group-panel">
      <div className="qh-group-panel-head">
        <h3>{group.label}</h3>
        <button className="qh-group-close" onClick={onClose} aria-label={t('Close')}>✕</button>
      </div>
      {group.numbered ? (
        <div className="qh-series">
          {group.members.map((m, i) => {
            const st = stats[m.id]
            return (
              <button key={m.id} className={`qh-series-btn${st ? ' played' : ''}`} onClick={() => onSelect(m.id)} title={m.label}>
                <span className="qh-series-num">#{i + 1}</span>
                <span className="qh-series-score">{st ? `${st.bestCorrect}/${st.bestTotal}` : t('Play ▸')}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="qh-grid">
          {group.members.map(m => <QuizTile key={m.id} item={m} st={stats[m.id]} onSelect={onSelect} />)}
        </div>
      )}
    </div>
  )
}
