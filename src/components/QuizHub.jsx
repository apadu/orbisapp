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
  { id: 'flag',           cat: 'flags',    icon: '🚩', label: t('Flags'),                difficulty: 'Easy',   desc: t('A grid of flags — name every country') },
  { id: 'flag-colors',    cat: 'flags',    icon: '🎨', label: t('Flag Colors'),          difficulty: 'Hard',   desc: t('Name countries from their flag\'s colour mix') },
  { id: 'emoji-quiz',     cat: 'flags',    icon: '🌍', label: t('Country Emoji'),        difficulty: 'Medium', desc: t('Each row is an emoji combo — name the country') },
  { id: 'capital',        cat: 'capitals', icon: '🏛️', label: t('Capitals'),             difficulty: 'Medium', desc: t('Type the capital of every country') },
  { id: 'cap-to-country', cat: 'capitals', icon: '🗺️', label: t('Countries by Capital'), difficulty: 'Hard',   desc: t('Name the country for every capital') },
  { id: 'scramble',       cat: 'words',    icon: '🔀', label: t('Scramble'),             difficulty: 'Medium', desc: t('Unscramble a whole table of country names') },
  { id: 'missing-vowels', cat: 'words',    icon: '🔡', label: t('Missing Vowels'),       difficulty: 'Medium', desc: t('Only consonants left — name every country') },
  { id: 'endonyms',       cat: 'words',    icon: '🔠', label: t('Endonyms'),             difficulty: 'Hard',   desc: t('Countries by the names they call themselves') },
  { id: 'country-fact',   cat: 'culture',  icon: '📖', label: t('Country by Fact'),      difficulty: 'Hard',   desc: t('One fact per row — name the country') },
  { id: 'currency',       cat: 'culture',  icon: '💰', label: t('Currencies'),           difficulty: 'Hard',   desc: t('Type the currency of every country') },
  { id: 'language',       cat: 'culture',  icon: '🗣️', label: t('Languages'),            difficulty: 'Hard',   desc: t('Type the main language of every country') },
  { id: 'pop-order',      cat: 'numbers',  icon: '📊', label: t('Most Populous'),        difficulty: 'Medium', desc: t('Name the 30 most populous countries') },
  { id: 'area',           cat: 'numbers',  icon: '📏', label: t('Largest Countries'),    difficulty: 'Easy',   desc: t('Name the 30 largest countries by area') },
  { id: 'flags-crescent', cat: 'flags', icon: '☪️', label: t('Flags with a Crescent'), difficulty: 'Medium', desc: t('Name every country with a crescent on its flag') },
  { id: 'flags-cross', cat: 'flags', icon: '✝️', label: t('Flags with a Cross'), difficulty: 'Medium', desc: t('Name every country with a cross or saltire on its flag') },
  { id: 'flags-sun', cat: 'flags', icon: '☀️', label: t('Flags with a Sun'), difficulty: 'Hard', desc: t('Name every country with a sun on its flag') },
  { id: 'landlocked', cat: 'lists', icon: '🏔️', label: t('Landlocked Countries'), difficulty: 'Medium', desc: t('Every country with no coastline') },
  { id: 'island-nations', cat: 'lists', icon: '🏝️', label: t('Island Nations'), difficulty: 'Medium', desc: t('Every country made up entirely of islands') },
  { id: 'eu-members', cat: 'lists', icon: '🇪🇺', label: t('EU Members'), difficulty: 'Easy', desc: t('All 27 members of the European Union') },
  { id: 'nato-members', cat: 'lists', icon: '🛡️', label: t('NATO Members'), difficulty: 'Medium', desc: t('All 32 NATO members') },
  { id: 'g20', cat: 'lists', icon: '💼', label: t('G20 Countries'), difficulty: 'Easy', desc: t('The 19 countries in the G20') },
  { id: 'former-ussr', cat: 'lists', icon: '☭', label: t('Former Soviet Republics'), difficulty: 'Medium', desc: t('The 15 countries that made up the USSR') },
  { id: 'former-yugoslavia', cat: 'lists', icon: '🧩', label: t('Former Yugoslavia'), difficulty: 'Easy', desc: t('The 7 countries that came out of Yugoslavia') },
  { id: 'equator', cat: 'lists', icon: '🌐', label: t('On the Equator'), difficulty: 'Medium', desc: t('Every country the Equator passes through') },
  { id: 'stans', cat: 'lists', icon: '🐎', label: t('The -stans'), difficulty: 'Easy', desc: t('Every country ending in "-stan"') },
  { id: 'spanish-speaking', cat: 'lists', icon: '🇪🇸', label: t('Spanish-speaking'), difficulty: 'Easy', desc: t('Every country where Spanish is official') },
  { id: 'portuguese-speaking', cat: 'lists', icon: '🇵🇹', label: t('Portuguese-speaking'), difficulty: 'Medium', desc: t('Every country where Portuguese is official') },
  { id: 'french-speaking', cat: 'lists', icon: '🇫🇷', label: t('French-speaking'), difficulty: 'Hard', desc: t('Every country where French is official') },
  { id: 'alphabet', cat: 'lists', icon: '🔤', label: t('A to Z'), difficulty: 'Easy', desc: t('One country for every letter of the alphabet') },
  { id: 'ww1', cat: 'culture', icon: '🪖', label: t('World War I Countries'), difficulty: 'Hard', desc: t('Austria-Hungary, the Ottoman Empire… name every country that fought') },
  { id: 'ww2', cat: 'culture', icon: '✈️', label: t('World War II Countries'), difficulty: 'Hard', desc: t('Yugoslavia, Czechoslovakia, the Soviet Union… name the main belligerents') },
  { id: 'former-names', cat: 'culture', icon: '📜', label: t('Former Country Names'), difficulty: 'Hard', desc: t('Ceylon, Persia, Rhodesia… which country is it today?') },
  { id: 'monarchies', cat: 'lists', icon: '👑', label: t('Monarchies Today'), difficulty: 'Medium', desc: t('Every country that still has a king, queen, emir or sultan') },
  { id: 'drive-left', cat: 'lists', icon: '🚗', label: t('Countries Driving on the Left'), difficulty: 'Hard', desc: t('About 55 countries keep left — name them all') },
  { id: 'named-after', cat: 'culture', icon: '👤', label: t('Countries Named After People'), difficulty: 'Hard', desc: t('Columbus → Colombia, Bolívar → Bolivia… name them all') },
  { id: 'euro-users', cat: 'culture', icon: '💶', label: t('Countries Using the Euro'), difficulty: 'Medium', desc: t('Every country that uses the euro') },
  { id: 'dollar-users', cat: 'culture', icon: '💵', label: t('Countries Using a Dollar'), difficulty: 'Hard', desc: t('Every country whose currency is a dollar') },
  { id: 'english-speaking', cat: 'lists', icon: '🇬🇧', label: t('English-speaking'), difficulty: 'Hard', desc: t('Every country where English is a main language') },
  { id: 'arabic-speaking', cat: 'lists', icon: '🕌', label: t('Arabic-speaking'), difficulty: 'Medium', desc: t('Every country where Arabic is a main language') },
  { id: 'capital-same-name', cat: 'capitals', icon: '🪞', label: t('Capital Shares the Name'), difficulty: 'Medium', desc: t('Mexico → Mexico City… find them all') },
  { id: 'capitals-a-z', cat: 'capitals', icon: '🔠', label: t('Capitals A to Z'), difficulty: 'Easy', desc: t('One capital for every letter of the alphabet') },
  { id: 'caribbean', cat: 'lists', icon: '🌴', label: t('Caribbean Countries'), difficulty: 'Medium', desc: t('The 13 island countries of the Caribbean') },
  { id: 'central-america', cat: 'lists', icon: '🌋', label: t('Central America'), difficulty: 'Easy', desc: t('The 7 countries of Central America') },
  { id: 'nordic', cat: 'lists', icon: '❄️', label: t('Nordic Countries'), difficulty: 'Easy', desc: t('The 5 Nordic countries') },
  { id: 'gulf-states', cat: 'lists', icon: '🛢️', label: t('Gulf States'), difficulty: 'Easy', desc: t('The 6 members of the Gulf Cooperation Council') },
  { id: 'smallest', cat: 'numbers', icon: '🔬', label: t('Smallest Countries'), difficulty: 'Hard', desc: t('The 20 smallest countries by area') },
  { id: 'least-populous', cat: 'numbers', icon: '🧍', label: t('Least Populous'), difficulty: 'Hard', desc: t('The 20 countries with the fewest people') },
  { id: 'higher-lower',   cat: 'arcade',   icon: '⚖️', label: t('Higher or Lower'),      difficulty: 'Easy',   desc: t('More people? Bigger? Keep the streak alive') },
  { id: 'true-false',     cat: 'arcade',   icon: '✅', label: t('True or False'),        difficulty: 'Medium', desc: t('Rapid-fire statements against the clock') },
  { id: 'country-wordle', cat: 'puzzles',  icon: '🟩', label: t('Country Wordle'),       difficulty: 'Medium', desc: t('A new country every day — guess it in 6 tries') },
  { id: 'connections',    cat: 'puzzles',  icon: '🧩', label: t('Connections'),          difficulty: 'Hard',   desc: t('Group 16 countries into 4 hidden categories') },
  { id: 'border-chain',   cat: 'puzzles',  icon: '🔗', label: t('Border Chain'),         difficulty: 'Hard',   desc: t('Connect two countries through shared borders') },
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
