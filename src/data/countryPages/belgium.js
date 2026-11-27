/**
 * Country page: Belgium (bilingual inline, like romania.js).
 * Facts: population 11.8 million (2024, Statbel); area 30,689 km²; Signal de Botrange 694 m; independence 1830.
 */
export const BELGIUM_PAGE = {
  id: 'be',
  flag: '🇧🇪',
  name: {"en": "Belgium", "ro": "Belgia"},
  tagline: {
    en: "Flemish, French and German, the EU's capital and great chocolate: 10 provinces plus Brussels.",
    ro: "Flamandă, franceză și germană, capitala UE și ciocolată bună: 10 provincii plus Bruxelles.",
  },
  mapHint: { en: "Hover or tap a province", ro: "Treci cu mouse-ul sau atinge o provincie" },
  facts: [
    { icon: '🏛️', label: { en: "Capital", ro: "Capitala" }, value: { en: "Brussels", ro: "Bruxelles" } },
    { icon: '👥', label: { en: "Population", ro: "Populație" }, value: { en: "11.8 million (2024)", ro: "11,8 milioane (2024)" } },
    { icon: '📐', label: { en: "Area", ro: "Suprafață" }, value: { en: "30,689 km²", ro: "30.689 km²" } },
    { icon: '🗺️', label: { en: "Divisions", ro: "Diviziuni" }, value: { en: "10 provinces + Brussels", ro: "10 provincii + Bruxelles" } },
    { icon: '⛰️', label: { en: "Highest point", ro: "Cel mai înalt punct" }, value: { en: "Signal de Botrange, 694 m", ro: "Signal de Botrange, 694 m" } },
    { icon: '💲', label: { en: "Currency", ro: "Moneda" }, value: { en: "Euro", ro: "Euro" } },
    { icon: '🗣️', label: { en: "Languages", ro: "Limbi" }, value: { en: "Dutch, French, German", ro: "Neerlandeză, franceză, germană" } },
    { icon: '📅', label: { en: "Independence", ro: "Independența" }, value: { en: "4 October 1830", ro: "4 octombrie 1830" } },
  ],
  neighbours: { en: "Netherlands, Germany, Luxembourg, France", ro: "Țările de Jos, Germania, Luxemburg, Franța" },
  questions: [
    { id: "capital", q: { en: "Capital, seat of the EU and NATO", ro: "Capitala, sediul UE și NATO" }, answers: ["Brussels", "Bruxelles", "Brussel"], show: { en: "Brussels", ro: "Bruxelles" } },
    { id: "atomium", q: { en: "Giant model of an iron crystal built for Expo 58", ro: "Modelul uriaș al unui cristal de fier construit pentru Expo 58" }, answers: ["Atomium"], show: { en: "Atomium", ro: "Atomium" } },
    { id: "manneken", q: { en: "Small bronze statue of a boy relieving himself", ro: "Mica statuie de bronz a unui băiețel care face pipi" }, answers: ["Manneken Pis", "Manneken-Pis", "Manneken"], show: { en: "Manneken Pis", ro: "Manneken Pis" } },
    { id: "flanders", q: { en: "Dutch-speaking northern region", ro: "Regiunea din nord unde se vorbește neerlandeză" }, answers: ["Flanders", "Vlaanderen", "Flandra", "Flandre"], show: { en: "Flanders", ro: "Flandra" } },
    { id: "wallonia", q: { en: "French-speaking southern region", ro: "Regiunea din sud unde se vorbește franceză" }, answers: ["Wallonia", "Wallonie", "Valonia", "Wallonië"], show: { en: "Wallonia", ro: "Valonia" } },
    { id: "german", q: { en: "Third official language, spoken in the east", ro: "A treia limbă oficială, vorbită în est" }, answers: ["German", "germană", "germana", "Deutsch"], show: { en: "German", ro: "Germana" } },
    { id: "waffle", q: { en: "Grid-patterned treat from Brussels or Liège", ro: "Desertul cu model de grilaj din Bruxelles sau Liège" }, answers: ["waffle", "waffles", "gofră", "gofre", "gofra", "gaufre"], show: { en: "Waffles", ro: "Gofrele" } },
    { id: "fries", q: { en: "Snack Belgians say they invented, despite the \"French\" name", ro: "Gustarea pe care belgienii spun că au inventat-o, deși se numește „franțuzească”" }, answers: ["fries", "french fries", "frites", "cartofi prăjiți", "cartofi prajiti", "frieten"], show: { en: "Fries", ro: "Cartofii prăjiți" } },
    { id: "tintin", q: { en: "Young reporter created by Hergé", ro: "Tânărul reporter creat de Hergé" }, answers: ["Tintin"], show: { en: "Tintin", ro: "Tintin" } },
    { id: "antwerp", q: { en: "Port city, the world capital of diamond trading", ro: "Orașul-port, capitala mondială a comerțului cu diamante" }, answers: ["Antwerp", "Antwerpen", "Anvers"], show: { en: "Antwerp", ro: "Anvers" } },
    { id: "bruges", q: { en: "Medieval city of canals, \"the Venice of the North\"", ro: "Orașul medieval cu canale, „Veneția Nordului”" }, answers: ["Bruges", "Brugge"], show: { en: "Bruges", ro: "Bruges" } },
    { id: "ghent", q: { en: "Flemish city of the Van Eyck altarpiece", ro: "Orașul flamand al altarului lui Van Eyck" }, answers: ["Ghent", "Gent", "Gand"], show: { en: "Ghent", ro: "Gent" } },
    { id: "waterloo", q: { en: "Battle of 1815 where Napoleon was finally defeated", ro: "Bătălia din 1815 în care Napoleon a fost învins definitiv" }, answers: ["Waterloo"], show: { en: "Waterloo", ro: "Waterloo" } },
    { id: "merckx", q: { en: "Cyclist with five Tour de France wins, \"the Cannibal\"", ro: "Ciclistul cu cinci Tururi ale Franței, „Canibalul”" }, answers: ["Eddy Merckx", "Merckx"], show: { en: "Eddy Merckx", ro: "Eddy Merckx" } },
    { id: "magritte", q: { en: "Surrealist painter of \"The Treachery of Images\"", ro: "Pictorul suprarealist al „Trădării imaginilor”" }, answers: ["René Magritte", "Rene Magritte", "Magritte"], show: { en: "René Magritte", ro: "René Magritte" } },
    { id: "spa", q: { en: "Ardennes town that gave its name to health resorts, home of a Formula 1 circuit", ro: "Orașul din Ardeni care a dat numele stațiunilor balneare, cu un circuit de Formula 1" }, answers: ["Spa", "Spa-Francorchamps", "Francorchamps"], show: { en: "Spa", ro: "Spa" } },
    { id: "ardennes", q: { en: "Forested hills in the south-east", ro: "Dealurile împădurite din sud-est" }, answers: ["Ardennes", "Ardenne", "Ardeni", "Ardenii", "Ardennen"], show: { en: "Ardennes", ro: "Ardenii" } },
    { id: "chocolate", q: { en: "Sweet of Neuhaus and Godiva, with the praline invented here", ro: "Dulciurile Neuhaus și Godiva, cu pralina inventată aici" }, answers: ["chocolate", "pralines", "praline", "ciocolată", "ciocolata", "pralină"], show: { en: "Chocolate", ro: "Ciocolata" } },
    { id: "king", q: { en: "Form of government", ro: "Forma de guvernământ" }, answers: ["monarchy", "constitutional monarchy", "kingdom", "monarhie", "monarhie constituțională", "regat"], show: { en: "Constitutional monarchy", ro: "Monarhie constituțională" } },
    { id: "1830", q: { en: "Year it broke away from the Netherlands", ro: "Anul în care s-a desprins de Țările de Jos" }, answers: ["1830"], show: { en: "1830", ro: "1830" } },
  ],
}
