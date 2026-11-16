import { useEffect, useMemo, useRef, useState } from 'react'
import { loadResults, subscribeResults } from '../utils/results'
import DailyBanner from './DailyBanner'
import { GAME_CATALOG } from '../utils/gameCatalog'
import { t, locale } from '../i18n'

// ── Catalogue ──────────────────────────────────────────────────────────────
export const QUIZ_CATEGORIES = [
  { id: 'flags',    label: t('Flags & symbols'), icon: '🚩', color: '#c77dff' },
  { id: 'capitals', label: t('Capitals'),        icon: '🏛️', color: '#2dd4bf' },
  { id: 'words',    label: t('Names & spelling'), icon: '🔤', color: '#f59e0b' },
  { id: 'culture',  label: t('Culture & facts'), icon: '📖', color: '#f472b6' },
  { id: 'numbers',  label: t('Size & numbers'),  icon: '📊', color: '#60a5fa' },
  { id: 'lists',    label: t('Lists & groups'),  icon: '📋', color: '#a3e635' },
  { id: 'arcade',   label: t('Arcade'),          icon: '🕹️', color: '#facc15' },
  { id: 'puzzles',  label: t('Puzzles'),         icon: '🧩', color: '#fb7185' },
]

export const QUIZ_ITEMS = [
  { id: 'flag',           cat: 'flags',    icon: '🚩', label: t('Flags'),                difficulty: 'Easy',   desc: t('Name 20 or 30 random flags. Watch out: Chad and Romania are near twins.') },
  { id: 'flag-colors',    cat: 'flags',    icon: '🎨', label: t('Flag Colors'),          difficulty: 'Hard',   desc: t('No shapes, no symbols — just the colour mix. Whose flag is it?') },
  { id: 'emoji-quiz',     cat: 'flags',    icon: '🌍', label: t('Country Emoji'),        difficulty: 'Medium', desc: t('Countries hidden in emoji combos. 100 of them, some very sneaky.') },
  { id: 'capital',        cat: 'capitals', icon: '🏛️', label: t('Capitals'),             difficulty: 'Medium', desc: t('197 capitals. Australia\'s isn\'t Sydney, Canada\'s isn\'t Toronto.') },
  { id: 'cap-to-country', cat: 'capitals', icon: '🗺️', label: t('Countries by Capital'), difficulty: 'Hard',   desc: t('Ouagadougou, Thimphu, Vaduz… which country does each one belong to?') },
  { id: 'scramble',       cat: 'words',    icon: '🔀', label: t('Scramble'),             difficulty: 'Medium', desc: t('RAMONIA is Romania. Can you untangle 30 more country names?') },
  { id: 'missing-vowels', cat: 'words',    icon: '🔡', label: t('Missing Vowels'),       difficulty: 'Medium', desc: t('MXC is Mexico, BRZL is Brazil. Only the consonants are left.') },
  { id: 'endonyms',       cat: 'words',    icon: '🔠', label: t('Endonyms'),             difficulty: 'Hard',   desc: t('Suomi, Sverige, Deutschland — countries by the names they call themselves.') },
  { id: 'country-fact',   cat: 'culture',  icon: '📖', label: t('Country by Fact'),      difficulty: 'Hard',   desc: t('More kangaroos than people? 62 surprising facts, one country each.') },
  { id: 'currency',       cat: 'culture',  icon: '💰', label: t('Currencies'),           difficulty: 'Hard',   desc: t('Lek, kwacha, ngultrum… name the money of every country.') },
  { id: 'language',       cat: 'culture',  icon: '🗣️', label: t('Languages'),            difficulty: 'Hard',   desc: t('Dari, Catalan, Dzongkha… name each country\'s main language.') },
  { id: 'pop-order',      cat: 'numbers',  icon: '📊', label: t('Most Populous'),        difficulty: 'Medium', desc: t('The top 30 by population. Ranks and head counts are your only clues.') },
  { id: 'area',           cat: 'numbers',  icon: '📏', label: t('Largest Countries'),    difficulty: 'Easy',   desc: t('The 30 largest countries. Algeria is #10 — bigger than Saudi Arabia.') },
  { id: 'flags-crescent', cat: 'flags', icon: '☪️', label: t('Flags with a Crescent'), difficulty: 'Medium', desc: t('13 flags with a crescent, from Algeria to Singapore.') },
  { id: 'flags-cross', cat: 'flags', icon: '✝️', label: t('Flags with a Cross'), difficulty: 'Medium', desc: t('13 flags with a cross — and not all of them are in Europe.') },
  { id: 'flags-sun', cat: 'flags', icon: '☀️', label: t('Flags with a Sun'), difficulty: 'Hard', desc: t('12 flags with a sun. Argentina\'s and Uruguay\'s even have faces.') },
  { id: 'landlocked', cat: 'lists', icon: '🏔️', label: t('Landlocked Countries'), difficulty: 'Medium', desc: t('45 countries with no coastline. Two are surrounded only by others like them.') },
  { id: 'island-nations', cat: 'lists', icon: '🏝️', label: t('Island Nations'), difficulty: 'Medium', desc: t('45 countries made only of islands. Indonesia alone has 17,000+.') },
  { id: 'eu-members', cat: 'lists', icon: '🇪🇺', label: t('EU Members'), difficulty: 'Easy', desc: t('All 27 EU members. Croatia, the newest, joined in 2013.') },
  { id: 'nato-members', cat: 'lists', icon: '🛡️', label: t('NATO Members'), difficulty: 'Medium', desc: t('All 32 NATO members. Sweden became number 32 in 2024.') },
  { id: 'g20', cat: 'lists', icon: '💼', label: t('G20 Countries'), difficulty: 'Easy', desc: t('19 countries plus the EU and the African Union. Name the 19.') },
  { id: 'former-ussr', cat: 'lists', icon: '☭', label: t('Former Soviet Republics'), difficulty: 'Medium', desc: t('15 republics, one union. Russia was just the biggest piece.') },
  { id: 'former-yugoslavia', cat: 'lists', icon: '🧩', label: t('Former Yugoslavia'), difficulty: 'Easy', desc: t('One country in 1990, seven today. Name them all.') },
  { id: 'equator', cat: 'lists', icon: '🌐', label: t('On the Equator'), difficulty: 'Medium', desc: t('The Equator crosses 13 countries — only one is named after it.') },
  { id: 'stans', cat: 'lists', icon: '🐎', label: t('The -stans'), difficulty: 'Easy', desc: t('Seven -stans. In Persian, "stan" means "land of".') },
  { id: 'spanish-speaking', cat: 'lists', icon: '🇪🇸', label: t('Spanish-speaking'), difficulty: 'Easy', desc: t('Spanish is official in 20 countries — one of them is in Africa.') },
  { id: 'portuguese-speaking', cat: 'lists', icon: '🇵🇹', label: t('Portuguese-speaking'), difficulty: 'Medium', desc: t('Portuguese is official in 9 countries on 4 continents.') },
  { id: 'french-speaking', cat: 'lists', icon: '🇫🇷', label: t('French-speaking'), difficulty: 'Hard', desc: t('French is official in 29 countries. Most of them are in Africa.') },
  { id: 'alphabet', cat: 'lists', icon: '🔤', label: t('A to Z'), difficulty: 'Easy', desc: t('One country per letter. Q has only one option.') },
  { id: 'ww1', cat: 'culture', icon: '🪖', label: t('World War I Countries'), difficulty: 'Hard', desc: t('28 nations under their 1914–18 names: Hejaz, Siam, Austria-Hungary…') },
  { id: 'ww2', cat: 'culture', icon: '✈️', label: t('World War II Countries'), difficulty: 'Hard', desc: t('34 belligerents. Some, like Italy and Romania, switched sides.') },
  { id: 'former-names', cat: 'culture', icon: '📜', label: t('Former Country Names'), difficulty: 'Hard', desc: t('Ceylon, Persia, Upper Volta… 39 old names. What are they called today?') },
  { id: 'monarchies', cat: 'lists', icon: '👑', label: t('Monarchies Today'), difficulty: 'Medium', desc: t('43 countries still have a monarch — 15 of them share the same king.') },
  { id: 'drive-left', cat: 'lists', icon: '🚗', label: t('Countries Driving on the Left'), difficulty: 'Hard', desc: t('54 countries keep left. It\'s not just Britain and its former colonies.') },
  { id: 'named-after', cat: 'culture', icon: '👤', label: t('Countries Named After People'), difficulty: 'Hard', desc: t('Columbus, Bolívar, King Philip II… 21 countries named after a person.') },
  { id: 'euro-users', cat: 'culture', icon: '💶', label: t('Countries Using the Euro'), difficulty: 'Medium', desc: t('27 countries use the euro — including some outside the EU.') },
  { id: 'dollar-users', cat: 'culture', icon: '💵', label: t('Countries Using a Dollar'), difficulty: 'Hard', desc: t('34 countries pay in dollars — some their own, some America\'s.') },
  { id: 'english-speaking', cat: 'lists', icon: '🇬🇧', label: t('English-speaking'), difficulty: 'Hard', desc: t('English is official or main in 60 countries, from Fiji to Sierra Leone.') },
  { id: 'arabic-speaking', cat: 'lists', icon: '🕌', label: t('Arabic-speaking'), difficulty: 'Medium', desc: t('25 countries, from Mauritania on the Atlantic to Oman on the Arabian Sea.') },
  { id: 'capital-same-name', cat: 'capitals', icon: '🪞', label: t('Capital Namesakes'), difficulty: 'Medium', desc: t('Kuwait → Kuwait City, Panama → Panama City. 14 countries like that.') },
  { id: 'capitals-a-z', cat: 'capitals', icon: '🔠', label: t('Capitals A to Z'), difficulty: 'Easy', desc: t('One capital per letter. For Q, there\'s only Quito.') },
  { id: 'caribbean', cat: 'lists', icon: '🌴', label: t('Caribbean Countries'), difficulty: 'Medium', desc: t('13 island countries, from Cuba down to tiny Saint Kitts and Nevis.') },
  { id: 'central-america', cat: 'lists', icon: '🌋', label: t('Central America'), difficulty: 'Easy', desc: t('7 countries between Mexico and Colombia. Only Belize has English as official.') },
  { id: 'nordic', cat: 'lists', icon: '❄️', label: t('Nordic Countries'), difficulty: 'Easy', desc: t('5 Nordic countries — but only 3 of them are Scandinavian.') },
  { id: 'gulf-states', cat: 'lists', icon: '🛢️', label: t('Gulf States'), difficulty: 'Easy', desc: t('6 Gulf Cooperation Council members. Iraq and Iran aren\'t among them.') },
  { id: 'smallest', cat: 'numbers', icon: '🔬', label: t('Smallest Countries'), difficulty: 'Hard', desc: t('The 20 smallest. Vatican City could fit into Central Park 7 times.') },
  { id: 'least-populous', cat: 'numbers', icon: '🧍', label: t('Least Populous'), difficulty: 'Hard', desc: t('The 20 tiniest populations. Tuvalu has about 11,000 people.') },
  { id: 'higher-lower',   cat: 'arcade',   icon: '⚖️', label: t('Higher or Lower'),      difficulty: 'Easy',   desc: t('More people? Bigger? One wrong call ends the streak.') },
  { id: 'true-false',     cat: 'arcade',   icon: '✅', label: t('True or False'),        difficulty: 'Medium', desc: t('Rapid-fire facts. True or false — every mistake costs 3 seconds.') },
  { id: 'country-wordle', cat: 'puzzles',  icon: '🟩', label: t('Country Wordle'),       difficulty: 'Medium', desc: t('One country a day, six tries, and colour clues for every letter.') },
  { id: 'connections',    cat: 'puzzles',  icon: '🧩', label: t('Connections'),          difficulty: 'Hard',   desc: t('16 countries, 4 hidden links. "One away!" means you\'re close.') },
  { id: 'border-chain',   cat: 'puzzles',  icon: '🔗', label: t('Border Chain'),         difficulty: 'Hard',   desc: t('Cross the map neighbour by neighbour. Can you match the shortest path?') },
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const DIFF_COLOR = { Easy: '#39ff14', Medium: '#f59e0b', Hard: '#ef4444' }

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
  const [filter, setFilter] = useState('all') // 'all' | 'unplayed' | 'Easy' | 'Medium' | 'Hard'
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
      if (DIFFICULTIES.includes(filter) && it.difficulty !== filter) return false
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
  const medalCount = (cls) => QUIZ_ITEMS.filter(q => stats[q.id]?.medal?.cls === cls).length
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
            <span className="qh-medals">
              <span title={t('Gold')}>🥇 {medalCount('gold')}</span>
              <span title={t('Silver')}>🥈 {medalCount('silver')}</span>
              <span title={t('Bronze')}>🥉 {medalCount('bronze')}</span>
            </span>
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
            <span className="qh-continue-icon">{lastQuiz.item.icon}</span>
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
            <span className="qh-continue-icon">🚩</span>
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
          <span aria-hidden="true">🔍</span>
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
          {[
            { id: 'all', label: t('All') },
            { id: 'unplayed', label: t('Not played ({v})', { v: QUIZ_ITEMS.length - played }) },
            ...DIFFICULTIES.map(d => ({ id: d, label: t(d) })),
          ].map(c => (
            <button key={c.id} className={`qh-chip${filter === c.id ? ' active' : ''}`} onClick={() => setFilter(c.id)}>
              {DIFFICULTIES.includes(c.id) && <span className="qh-dot" style={{ background: DIFF_COLOR[c.id] }} />}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category rows ── */}
      {visible.length === 0 ? (
        <div className="qh-empty">
          <span>{t('No quizzes match.')}</span>
          <button onClick={() => { setQuery(''); setFilter('all') }}>{t('Clear filters')}</button>
        </div>
      ) : QUIZ_CATEGORIES.map(cat => {
        const items = visible.filter(it => it.cat === cat.id)
        if (!items.length) return null
        const catAll = QUIZ_ITEMS.filter(it => it.cat === cat.id)
        const catPlayed = catAll.filter(it => stats[it.id]).length
        return (
          <section key={cat.id} className="qh-section" style={{ '--cat': cat.color }}>
            <div className="qh-section-head">
              <span className="qh-section-icon">{cat.icon}</span>
              <h2>{cat.label}</h2>
              <span className="qh-section-count">{catPlayed}/{catAll.length}</span>
            </div>
            <div className="qh-grid">
              {items.map(it => <QuizTile key={it.id} item={it} st={stats[it.id]} onSelect={onSelect} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function QuizTile({ item, st, onSelect }) {
  return (
    <button className={`qh-tile${st ? '' : ' qh-tile-new'}`} onClick={() => onSelect(item.id)}>
      <span className="qh-tile-top">
        <span className="qh-tile-icon">{item.icon}</span>
        {st?.medal
          ? <span className={`qh-tile-medal qh-medal-${st.medal.cls}`} title={t('{label} medal', { label: st.medal.label })}>{st.medal.icon}</span>
          : !st && <span className="qh-tile-new-badge">{t('New')}</span>}
      </span>
      <span className="qh-tile-name">{item.label}</span>
      <span className="qh-tile-desc">{item.desc}</span>
      <span className="qh-tile-foot">
        {item.difficulty
          ? <span className="qh-tile-diff"><span className="qh-dot" style={{ background: DIFF_COLOR[item.difficulty] }} />{t(item.difficulty)}</span>
          : <span className="qh-tile-diff">{item.tag ?? ''}</span>}
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
