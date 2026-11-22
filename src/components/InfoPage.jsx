import { isRo, t } from '../i18n'

// Where people can reach you. Until you have an email on your own domain, the
// feedback form doubles as the contact channel.
export const CONTACT_EMAIL = ''                       // e.g. 'hello@yourdomain.com'
const CONTACT_FORM = 'https://forms.gle/hDpMyhns9PD7ghdBA'
const UPDATED = '2026-11-23'

function Contact() {
  return CONTACT_EMAIL
    ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    : <a href={CONTACT_FORM} target="_blank" rel="noopener noreferrer">{isRo ? 'formularul de contact' : 'our contact form'}</a>
}

// ── Privacy ────────────────────────────────────────────────────────────────
const PRIVACY_EN = () => (
  <>
    <p>GeoFeverr is a geography game. We collect as little as possible and never sell your data. This page explains what we store and why.</p>
    <h2>Playing without an account</h2>
    <p>As a guest, your progress (game results, XP, settings such as language and sound) is saved only in your browser's local storage, on your device. It is not sent to us. Clearing your browser data deletes it.</p>
    <h2>If you create an account</h2>
    <ul>
      <li><b>Email address</b> — to sign in, confirm your account and reset your password.</li>
      <li><b>Username</b> — shown on your profile and on public leaderboards.</li>
      <li><b>Password</b> — stored only as a secure hash by our authentication provider; we never see it.</li>
      <li><b>Game results</b> — scores, answers, time played and dates, so your stats, XP and leaderboard positions follow you across devices.</li>
    </ul>
    <p>Your username and best scores are public on leaderboards. Your email is never shown to other players.</p>
    <p>If you sign in with <b>Google</b>, Google shares your name, email address and profile picture with us. We keep the email, a username made from your name and the picture.</p>
    <h2>Comments and ratings</h2>
    <p>Comments you post under a quiz are public, together with your username and picture. You can edit or delete them at any time. If other players report a comment, we may hide it. Quiz ratings are private: only the average is shown.</p>
    <h2>Playing with friends (“Don't Say What I Say”)</h2>
    <p>In a room, the other players see the name you type and your answers once each round ends. Answers travel live through Supabase Realtime and are not stored. Public rooms are listed with their code, the host's name and the category. Your match result is saved like any other game; if you're signed in, wins count on the public wins board.</p>
    <h2>Anonymous quiz statistics</h2>
    <p>When you finish a quiz, its score is also counted anonymously (no account, device or session attached) so we can show how you did compared to everyone else.</p>
    <h2>Service providers</h2>
    <ul>
      <li><b>Supabase</b> — database and sign-in (stores the account data above).</li>
      <li><b>Vercel</b> — hosts the website; also provides Vercel Web Analytics, which counts page views anonymously without cookies.</li>
    </ul>
    <p>We don't use advertising or tracking cookies, and we don't share your data with anyone else.</p>
    <h2>Usage statistics and error reports</h2>
    <p>To see which pages are used and to fix bugs, GeoFeverr also records, in its own database: the page you open, the site you came from (just its name), the type of device (phone, tablet or computer) and the app language, grouped by a random number that only lasts while the tab is open. No cookies, no IP address, no fingerprinting. If your browser sends “Do Not Track”, nothing is recorded. When something crashes, we save the technical error message, the page and your browser version so we can fix it. If you're signed in, both are linked to your account. Page statistics are deleted after 180 days.</p>
    <h2>How long we keep it</h2>
    <p>Account data is kept until you delete your account. Guest data stays on your device until you clear it.</p>
    <h2>Your rights</h2>
    <p>You can see your data on your profile and delete your account at any time from <b>Profile → Delete account</b>; this permanently removes your account, username and all saved games. Under the GDPR you may also ask us for a copy of your data or to correct it — contact us via <Contact />.</p>
    <h2>Children</h2>
    <p>GeoFeverr is suitable for all ages. If you are under 16, please ask a parent or guardian before creating an account.</p>
    <h2>Changes</h2>
    <p>If this policy changes, we'll update the date below.</p>
  </>
)

const PRIVACY_RO = () => (
  <>
    <p>GeoFeverr este un joc de geografie. Colectăm cât mai puține date și nu le vindem niciodată. Pagina aceasta explică ce stocăm și de ce.</p>
    <h2>Dacă joci fără cont</h2>
    <p>Ca invitat, progresul tău (rezultatele jocurilor, XP-ul, setări ca limba și sunetul) este salvat doar în memoria locală a browserului, pe dispozitivul tău. Nu ne este trimis. Dacă ștergi datele browserului, se șterge și progresul.</p>
    <h2>Dacă îți creezi un cont</h2>
    <ul>
      <li><b>Adresa de email</b> — pentru conectare, confirmarea contului și resetarea parolei.</li>
      <li><b>Numele de utilizator</b> — apare pe profil și în clasamentele publice.</li>
      <li><b>Parola</b> — păstrată doar sub formă criptată (hash) de furnizorul de autentificare; noi nu o vedem.</li>
      <li><b>Rezultatele jocurilor</b> — scoruri, răspunsuri, durată și date, ca statisticile, XP-ul și locul în clasamente să te urmeze pe orice dispozitiv.</li>
    </ul>
    <p>Numele de utilizator și cele mai bune scoruri sunt publice în clasamente. Emailul nu este afișat niciodată altor jucători.</p>
    <p>Dacă te conectezi cu <b>Google</b>, Google ne transmite numele, adresa de email și poza de profil. Păstrăm emailul, un nume de utilizator făcut din numele tău și poza.</p>
    <h2>Comentarii și note</h2>
    <p>Comentariile scrise sub un quiz sunt publice, împreună cu numele de utilizator și poza ta. Le poți modifica sau șterge oricând. Dacă alți jucători raportează un comentariu, îl putem ascunde. Notele date quizurilor sunt private: se afișează doar media.</p>
    <h2>Jocul cu prietenii („Nu spune ce spun eu”)</h2>
    <p>Într-o cameră, ceilalți jucători văd numele pe care îl scrii și răspunsurile tale, după ce se termină fiecare rundă. Răspunsurile circulă în timp real prin Supabase Realtime și nu sunt stocate. Camerele publice apar în listă cu codul, numele gazdei și categoria. Rezultatul meciului se salvează ca orice alt joc; dacă ești conectat, victoriile apar în clasamentul public de victorii.</p>
    <h2>Statistici anonime ale quizurilor</h2>
    <p>Când termini un quiz, scorul este numărat și anonim (fără cont, dispozitiv sau sesiune) ca să-ți putem arăta cum te-ai descurcat față de ceilalți.</p>
    <h2>Furnizori</h2>
    <ul>
      <li><b>Supabase</b> — baza de date și autentificarea (stochează datele de cont de mai sus).</li>
      <li><b>Vercel</b> — găzduiește site-ul; oferă și Vercel Web Analytics, care numără vizitele anonim, fără cookie-uri.</li>
    </ul>
    <p>Nu folosim reclame sau cookie-uri de urmărire și nu împărtășim datele tale cu nimeni altcineva.</p>
    <h2>Statistici de utilizare și rapoarte de erori</h2>
    <p>Ca să vedem ce pagini sunt folosite și să reparăm erorile, GeoFeverr înregistrează și în propria bază de date: pagina deschisă, site-ul de unde vii (doar numele lui), tipul dispozitivului (telefon, tabletă sau calculator) și limba aplicației, grupate după un număr aleatoriu care există doar cât e deschis tab-ul. Fără cookie-uri, fără adresă IP, fără amprentare. Dacă browserul tău trimite „Do Not Track”, nu se înregistrează nimic. Când ceva se blochează, salvăm mesajul tehnic al erorii, pagina și versiunea browserului, ca să o putem repara. Dacă ești conectat, ambele sunt legate de contul tău. Statisticile de pagini se șterg după 180 de zile.</p>
    <h2>Cât timp le păstrăm</h2>
    <p>Datele contului sunt păstrate până îți ștergi contul. Datele de invitat rămân pe dispozitivul tău până le ștergi.</p>
    <h2>Drepturile tale</h2>
    <p>Îți poți vedea datele pe profil și îți poți șterge contul oricând din <b>Profil → Șterge contul</b>; asta elimină definitiv contul, numele de utilizator și toate jocurile salvate. Conform GDPR, ne poți cere și o copie a datelor sau corectarea lor — scrie-ne prin <Contact />.</p>
    <h2>Copii</h2>
    <p>GeoFeverr este potrivit pentru toate vârstele. Dacă ai sub 16 ani, cere acordul unui părinte înainte să-ți creezi cont.</p>
    <h2>Modificări</h2>
    <p>Dacă politica se schimbă, actualizăm data de mai jos.</p>
  </>
)

// ── Terms ──────────────────────────────────────────────────────────────────
const TERMS_EN = () => (
  <>
    <p>By using GeoFeverr you agree to these simple terms.</p>
    <h2>The service</h2>
    <p>GeoFeverr is a free geography game provided "as is". We work hard to keep the facts accurate, but borders, names, capitals and statistics can be disputed or change — GeoFeverr is not an authoritative source. Map boundaries don't imply any political position.</p>
    <h2>Your account</h2>
    <ul>
      <li>Keep your password safe; you're responsible for activity on your account.</li>
      <li>Usernames must not be offensive, impersonate others or contain personal data of other people. We may remove usernames or accounts that break this rule.</li>
      <li>You can delete your account at any time from your profile.</li>
    </ul>
    <h2>Comments and playing with others</h2>
    <p>Be respectful. No insults, hate, spam, ads or other people's personal data — in comments, in usernames or in the names you use in multiplayer rooms. We may hide comments and remove accounts that break this rule.</p>
    <h2>Fair play</h2>
    <p>Don't cheat, automate games or tamper with scores. Results that look impossible are automatically left out of leaderboards, and we may remove scores or accounts that abuse the game.</p>
    <h2>Availability</h2>
    <p>We may change, add or remove games and features, and the service may occasionally be unavailable. We're not liable for lost progress or other damages to the extent permitted by law.</p>
    <h2>Changes</h2>
    <p>We may update these terms; the date below shows the latest version. Questions? Reach us via <Contact />.</p>
  </>
)

const TERMS_RO = () => (
  <>
    <p>Folosind GeoFeverr, ești de acord cu acești termeni simpli.</p>
    <h2>Serviciul</h2>
    <p>GeoFeverr este un joc de geografie gratuit, oferit „ca atare”. Ne străduim ca informațiile să fie corecte, dar granițele, numele, capitalele și statisticile pot fi disputate sau se pot schimba — GeoFeverr nu este o sursă oficială. Granițele de pe hartă nu exprimă nicio poziție politică.</p>
    <h2>Contul tău</h2>
    <ul>
      <li>Păstrează-ți parola în siguranță; ești responsabil pentru activitatea din contul tău.</li>
      <li>Numele de utilizator nu trebuie să fie jignitor, să se dea drept altcineva sau să conțină date personale ale altor oameni. Putem elimina numele sau conturile care încalcă regula.</li>
      <li>Îți poți șterge contul oricând, din profil.</li>
    </ul>
    <h2>Comentarii și jocul cu alții</h2>
    <p>Fii respectuos. Fără jigniri, ură, spam, reclame sau date personale ale altor oameni — în comentarii, în numele de utilizator sau în numele folosite în camerele de joc. Putem ascunde comentariile și elimina conturile care încalcă regula.</p>
    <h2>Joc corect</h2>
    <p>Nu trișa, nu automatiza jocurile și nu modifica scorurile. Rezultatele imposibile sunt excluse automat din clasamente, iar scorurile sau conturile care abuzează de joc pot fi eliminate.</p>
    <h2>Disponibilitate</h2>
    <p>Putem schimba, adăuga sau elimina jocuri și funcții, iar serviciul poate fi uneori indisponibil. În limitele permise de lege, nu răspundem pentru progres pierdut sau alte daune.</p>
    <h2>Modificări</h2>
    <p>Putem actualiza acești termeni; data de mai jos arată ultima versiune. Întrebări? Scrie-ne prin <Contact />.</p>
  </>
)

// ── Credits ────────────────────────────────────────────────────────────────
const CREDITS = [
  ['Natural Earth', 'https://www.naturalearthdata.com', { en: 'Country borders, seas, rivers, mountain ranges, Romanian counties and US states — public domain', ro: 'Granițele țărilor, mările, râurile, lanțurile muntoase, județele României și statele SUA — domeniu public' }],
  ['geoBoundaries', 'https://www.geoboundaries.org', { en: 'Districts of Moldova (data from UNHCR / OCHA) — CC BY 3.0 IGO', ro: 'Raioanele Republicii Moldova (date UNHCR / OCHA) — CC BY 3.0 IGO' }],
  ['Flagpedia / flagcdn.com', 'https://flagpedia.net', { en: 'Flag images', ro: 'Imaginile steagurilor' }],
  ['historical-basemaps (A. Ourednik)', 'https://github.com/aourednik/historical-basemaps', { en: 'Historical world maps (AD 100, 1279, 1700, 1914, 1920) — GPL-3.0', ro: 'Hărțile istorice ale lumii (anii 100, 1279, 1700, 1914, 1920) — GPL-3.0' }],
  ['NASA Blue Marble (Visible Earth)', 'https://visibleearth.nasa.gov', { en: 'Elevation data for the shaded relief of the mountain-ranges globe — public domain', ro: 'Datele de altitudine pentru relieful globului cu lanțuri muntoase — domeniu public' }],
  ['PB2002 (Peter Bird) via fraxen/tectonicplates', 'https://github.com/fraxen/tectonicplates', { en: 'Tectonic plates — ODC-By 1.0', ro: 'Plăcile tectonice — ODC-By 1.0' }],
  ['World Bank Open Data', 'https://data.worldbank.org', { en: 'Population figures', ro: 'Datele despre populație' }],
  ['IANA Time Zone Database', 'https://www.iana.org/time-zones', { en: 'Time zones (via your browser)', ro: 'Fusurile orare (prin browserul tău)' }],
  ['three.js', 'https://threejs.org', { en: 'The 3D globe — MIT license', ro: 'Globul 3D — licență MIT' }],
  ['d3-geo & Turf.js', 'https://d3js.org', { en: 'Map projections and geometry — ISC / MIT', ro: 'Proiecții și geometrie — ISC / MIT' }],
  ['React & Vite', 'https://react.dev', { en: 'App framework and build tool — MIT', ro: 'Framework-ul aplicației și unealta de build — MIT' }],
  ['Supabase', 'https://supabase.com', { en: 'Accounts, database and leaderboards', ro: 'Conturi, bază de date și clasamente' }],
]

const CREDITS_PAGE = () => (
  <>
    <p>{isRo
      ? 'GeoFeverr există datorită datelor și proiectelor open-source de mai jos. Mulțumim!'
      : 'GeoFeverr is built on the open data and open-source projects below. Thank you!'}</p>
    <ul className="info-credits">
      {CREDITS.map(([name, url, d]) => (
        <li key={name}>
          <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
          <span>{isRo ? d.ro : d.en}</span>
        </li>
      ))}
    </ul>
    <p className="info-muted">{isRo
      ? 'Capitalele, monedele, limbile, faptele despre țări și coordonatele monumentelor au fost compilate pentru GeoFeverr din surse publice. Ai găsit o greșeală? Spune-ne prin '
      : 'Capitals, currencies, languages, country facts and landmark coordinates were compiled for GeoFeverr from public sources. Spotted a mistake? Tell us via '}<Contact />.</p>
  </>
)

export const INFO_PAGES = {
  privacy: { title: () => t('Privacy Policy'), body: () => (isRo ? <PRIVACY_RO /> : <PRIVACY_EN />) },
  terms:   { title: () => t('Terms of Use'),   body: () => (isRo ? <TERMS_RO /> : <TERMS_EN />) },
  credits: { title: () => t('Credits'),        body: () => <CREDITS_PAGE /> },
}

export default function InfoPage({ doc, onBack, onOpen }) {
  const page = INFO_PAGES[doc] ?? INFO_PAGES.privacy
  return (
    <div className="info-page">
      <button className="profile-back" onClick={onBack}>{t('← Back')}</button>
      <article className="info-article">
        <h1>{page.title()}</h1>
        {page.body()}
        {doc !== 'credits' && <p className="info-muted">{t('Last updated')}: {UPDATED}</p>}
      </article>
      <InfoLinks current={doc} onOpen={onOpen} />
    </div>
  )
}

/** Small footer row with links to the three pages. */
export function InfoLinks({ current, onOpen }) {
  return (
    <nav className="info-links">
      {Object.entries(INFO_PAGES).map(([id, p]) => (
        <a key={id} href={`/${id}`} className={current === id ? 'active' : ''}
          onClick={e => { e.preventDefault(); onOpen(id) }}>{p.title()}</a>
      ))}
      <span>© {new Date().getFullYear()} GeoFeverr</span>
    </nav>
  )
}
