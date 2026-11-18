import { useEffect, useMemo, useRef, useState } from 'react'
import { loadResults, subscribeResults } from '../utils/results'
import DailyBanner from './DailyBanner'
import { GAME_CATALOG } from '../utils/gameCatalog'
import { t, locale } from '../i18n'
import { gameTag, isNewGame } from '../utils/gameTags'
import GameIcon from './GameIcon'
import Icon from './Icon'
import { TRIPOINT_QUIZZES } from '../quizzes/tripointQuizzes'
import { useQuizOverview, rankScore } from '../utils/quizOverview'
import StateNote from './StateNote'

// ── Catalogue ──────────────────────────────────────────────────────────────
export const QUIZ_CATEGORIES = [
  { id: 'flags',    label: t('Flags & symbols'), icon: '🚩', color: '#D98C7A' },
  { id: 'capitals', label: t('Capitals'),        icon: '🏛️', color: '#5FB7A8' },
  { id: 'words',    label: t('Names & spelling'), icon: '🔤', color: '#E2B65C' },
  { id: 'culture',  label: t('Culture & facts'), icon: '📖', color: '#D9C49A' },
  { id: 'numbers',  label: t('Size & numbers'),  icon: '📊', color: '#6FA8DC' },
  { id: 'lists',    label: t('Lists & groups'),  icon: '📋', color: '#8CC18F' },
  { id: 'arcade',   label: t('Arcade'),          icon: '🕹️', color: '#FF7A3D' },
  { id: 'puzzles',  label: t('Puzzles'),         icon: '🧩', color: '#9BB3CF' },
  { id: 'maps',     label: t('Maps'),            icon: '🗺️', color: '#7FB0C9' },
]

export const QUIZ_ITEMS = [
  { id: 'flag',           cat: 'flags',    icon: '🚩', label: t('Flags'),                desc: t('Name 20 or 30 random flags. Watch out: Chad and Romania are near twins.') },
  { id: 'flag-colors',    cat: 'flags',    icon: '🎨', label: t('Flag Colors'),          desc: t('No shapes, no symbols — just the colour mix. Whose flag is it?') },
  { id: 'emoji-quiz',     cat: 'flags',    icon: '🌍', label: t('Country Emoji'),        desc: t('Countries hidden in emoji combos. 100 of them, some very sneaky.') },
  { id: 'capital',        cat: 'capitals', icon: '🏛️', label: t('Capitals'),             desc: t('196 capitals. Australia\'s isn\'t Sydney, Canada\'s isn\'t Toronto.') },
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
  { id: 'former-ussr', cat: 'lists', icon: '☭', label: t('Former Soviet Republics'), desc: t('15 republics, one union. Russia was just the biggest piece.') },
  { id: 'former-yugoslavia', cat: 'lists', icon: '🧩', label: t('Former Yugoslavia'), desc: t('One country in 1990, seven today. Name them all.') },
  { id: 'equator', cat: 'lists', icon: '🌐', label: t('On the Equator'), desc: t('The Equator crosses 13 countries — only one is named after it.') },
  { id: 'stans', cat: 'lists', icon: '🐎', label: t('The -stans'), desc: t('Seven -stans. In Persian, "stan" means "land of".') },
  { id: 'spanish-speaking', cat: 'lists', icon: '🇪🇸', label: t('Spanish-speaking'), desc: t('Spanish is official in 20 countries — one of them is in Africa.') },
  { id: 'portuguese-speaking', cat: 'lists', icon: '🇵🇹', label: t('Portuguese-speaking'), desc: t('Portuguese is official in 9 countries on 4 continents.') },
  { id: 'french-speaking', cat: 'lists', icon: '🇫🇷', label: t('French-speaking'), desc: t('French is official in 29 countries. Most of them are in Africa.') },
  { id: 'alphabet', cat: 'lists', icon: '🔤', label: t('A to Z'), desc: t('One country per letter. Q has only one option.') },
  { id: 'ww1', cat: 'culture', icon: '🪖', label: t('World War I Countries'), desc: t('28 nations under their 1914–18 names: Hejaz, Siam, Austria-Hungary…') },
  { id: 'ww2', cat: 'culture', icon: '✈️', label: t('World War II Countries'), desc: t('34 belligerents. Some, like Italy and Romania, switched sides.') },
  { id: 'former-names', cat: 'culture', icon: '📜', label: t('Former Country Names'), desc: t('Ceylon, Persia, Upper Volta… 39 old names. What are they called today?') },
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
  { id: 'true-false',     cat: 'arcade',   icon: '✅', label: t('True or False'),        desc: t('Rapid-fire facts. True or false — every mistake costs 3 seconds.') },
  { id: 'country-wordle', cat: 'puzzles',  icon: '🟩', label: t('Country Wordle'),       desc: t('One country a day, six tries, and colour clues for every letter.') },
  { id: 'connections',    cat: 'puzzles',  icon: '🧩', label: t('Country Connections'),          desc: t('16 countries, 4 hidden links. "One away!" means you\'re close.') },
  { id: 'border-chain',   cat: 'puzzles',  icon: '🔗', label: t('Border Chain'),         desc: t('Cross the map neighbour by neighbour. Can you match the shortest path?') },
  { id: 'islands',        cat: 'maps',     icon: '🏝️', label: t('Famous Islands'),       desc: t('30 famous islands lit up on the world map, from Greenland to Mallorca.') },
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
  const [filter, setFilter] = useState('all') // 'all' | 'unplayed'
  const [cat,    setCat]    = useState(() => { try { return sessionStorage.getItem('orbis-qh-cat') ?? 'all' } catch { return 'all' } })
  const [openGroup, setOpenGroup] = useState(null)
  const [sort, setSort] = useState('default')   // default | rated | popular
  const overview = useQuizOverview()
  const hasRatings = Object.values(overview).some(o => o.ratings > 0)
  const hasPlays = Object.values(overview).some(o => o.playsWeek > 0)
  const chooseCat = (c) => { setCat(c); setOpenGroup(null); try { sessionStorage.setItem('orbis-qh-cat', c) } catch { /* private mode */ } }
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

  const played = QUIZ_ITEMS.filter(q => stats[q.id]).length
  const filtering = query.trim() !== '' || filter !== 'all'

  const onSearchKey = (e) => {
    if (e.key === 'Enter' && visible.length === 1) onSelect(visible[0].id)
    if (e.key === 'Escape') { setQuery(''); e.currentTarget.blur() }
  }

  return (
    <div className="qh">
      {/* ── Header ── */}
      <header className="qh-head">
        <div>
          <h1 className="qh-title">{t('Quiz Hub')}</h1>
          <p className="qh-sub">{QUIZ_ITEMS.length} {t('quizzes · type answers in any order · pick a region')}</p>
        </div>
        <div className="qh-progress">
          <div className="qh-progress-row">
            <span><strong>{played}</strong>/{QUIZ_ITEMS.length} {t('played')}</span>
          </div>
          <div className="qh-progress-bar"><div style={{ width: `${(played / QUIZ_ITEMS.length) * 100}%` }} /></div>
        </div>
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
          <button className={`qh-chip${filter === 'unplayed' ? ' active' : ''}`} aria-pressed={filter === 'unplayed'}
            onClick={() => setFilter(f => (f === 'unplayed' ? 'all' : 'unplayed'))}>
            {t('Not played ({v})', { v: QUIZ_ITEMS.length - played })}
          </button>
          {(hasRatings || hasPlays) && <span className="qh-chip-sep" aria-hidden="true" />}
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

      {/* ── Categories ── */}
      <div className="qh-cats" role="tablist" aria-label={t('Categories')}>
        {[{ id: 'all', label: t('All') }, ...QUIZ_CATEGORIES].map(c => (
          <button key={c.id} role="tab" aria-selected={cat === c.id} className={`qh-cat${cat === c.id ? ' active' : ''}`} onClick={() => chooseCat(c.id)}
            style={c.color ? { '--cat': c.color } : undefined}>
            {c.label}
            {c.id !== 'all' && <span className="qh-cat-n">{QUIZ_ITEMS.filter(q => q.cat === c.id).length}</span>}
          </button>
        ))}
      </div>

      {/* ── Category rows (or one sorted list) ── */}
      {sort !== 'default' && visible.length > 0 ? (
        <section className="qh-section">
          <div className="qh-section-head">
            <h2>{sort === 'rated' ? t('Top rated') : t('Popular this week')}</h2>
            <span className="qh-section-count">{cat === 'all' ? t('All') : QUIZ_CATEGORIES.find(c => c.id === cat)?.label}</span>
          </div>
          <div className="qh-grid">
            {visible
              .filter(it => cat === 'all' || it.cat === cat)
              .map((it, i) => ({ it, i, key: sort === 'rated' ? rankScore(overview[it.id]) : (overview[it.id]?.playsWeek ?? 0) }))
              .sort((a, b) => b.key - a.key || a.i - b.i)
              .map(({ it }) => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onSelect} rating={overview[it.id]} />)}
          </div>
        </section>
      ) : visible.length === 0 ? (
        <StateNote action={{ label: t('Clear filters'), onClick: () => { setQuery(''); setFilter('all') } }}>{t('No quizzes match.')}</StateNote>
      ) : QUIZ_CATEGORIES.filter(c => cat === 'all' || c.id === cat).map(c => {
        const catAll = QUIZ_ITEMS.filter(it => it.cat === c.id)
        const catPlayed = catAll.filter(it => stats[it.id]).length
        // Searching / "not played": every matching quiz, ungrouped
        const entries = filtering
          ? visible.filter(it => it.cat === c.id).map(item => ({ type: 'quiz', item }))
          : entriesFor(c.id)
        if (!entries.length) return null
        const capped = !filtering && cat === 'all' && entries.length > CAP
        const shown = capped ? entries.slice(0, CAP) : entries
        const open = shown.find(e => e.type === 'group' && e.group.id === openGroup)?.group
        return (
          <section key={c.id} className="qh-section" style={{ '--cat': c.color }}>
            <div className="qh-section-head">
              <span className="qh-section-icon"><GameIcon id={QUIZ_ITEMS.find(q => q.cat === c.id)?.id} size={18} /></span>
              <h2>{c.label}</h2>
              <span className="qh-section-count">{catPlayed}/{catAll.length}</span>
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

/** One card for a set of quizzes: how many of its parts you've played; opens the GroupPanel. */
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
      <span className="qh-group-bar"><span style={{ width: `${(played / ids.length) * 100}%` }} /></span>
      <span className="qh-tile-foot">
        <span className="qh-tile-tag">{t('{n} quizzes', { n: ids.length })} · {t('{n} played', { n: played })}</span>
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
