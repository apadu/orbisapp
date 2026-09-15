import { useState } from 'react'
import DailyChallengeHub from './DailyChallengeHub'

const CAT_COLORS = {
  guess:      { bg: 'rgba(199, 125, 255, 0.14)', border: 'rgba(199, 125, 255, 0.4)' },
  'name-all': { bg: 'rgba(57, 255, 20, 0.10)',   border: 'rgba(57, 255, 20, 0.35)'  },
  explore:    { bg: 'rgba(251, 191, 36, 0.12)',  border: 'rgba(251, 191, 36, 0.38)' },
}

const CAT_LABELS = {
  all:        '✦ All',
  guess:      '🔍 Guess',
  'name-all': '📝 Name All',
  explore:    '🌐 Explore',
}

// Globe-based games only — quiz games live on their own page
const MODES = [
  { id: 'mystery',             icon: '🔍', label: 'Mystery Country',  desc: 'Guess the hidden country from clues',                          category: 'guess'    },
  { id: 'locate',              icon: '📍', label: 'Pinpoint',          desc: 'Drop the pin for the given country',                           category: 'guess'    },
  { id: 'neighbor',            icon: '📌', label: 'Neighbors',         desc: 'Name all countries sharing a border',                          category: 'guess'    },
  { id: 'missing',             icon: '🗺️', label: 'Blind Map',         desc: '20 random countries are missing — guess them before time runs out', category: 'guess' },
  { id: 'spotlight',           icon: '🔦', label: 'Solo Map',          desc: 'Fill in a blank map at your own pace',                         category: 'guess'    },
  { id: 'name-all',            icon: '🌍', label: 'Countries',         desc: 'Name every country in the world',                              category: 'name-all' },
  { id: 'name-all-caps',       icon: '🏙️', label: 'Capitals',          desc: 'Name every capital city',                                      category: 'name-all' },
  { id: 'name-all-currencies', icon: '💰', label: 'Currencies',        desc: 'Name every currency',                                          category: 'name-all' },
  { id: 'name-all-languages',  icon: '🗣️', label: 'Languages',         desc: 'Name the official languages',                                  category: 'name-all' },
  { id: 'mountains',           icon: '⛰️', label: 'Mountains',         desc: 'Name every major mountain range',                              category: 'name-all' },
  { id: 'name-all-seas',       icon: '🌊', label: 'Seas',              desc: 'Name every sea',                                               category: 'name-all' },
  { id: 'name-all-rivers',     icon: '🏞️', label: 'Rivers',            desc: 'Name every major river worldwide',                             category: 'name-all' },
  { id: 'history-maps',        icon: '🏛️', label: 'History Maps',      desc: 'Name countries across historical eras',                        category: 'name-all' },
  { id: 'learn',               icon: '🎓', label: 'Learn',             desc: 'Click any country to explore its facts',                       category: 'explore'  },
]

export default function HomePage({ onEnter, onSelectMode, onEnterQuiz, dailyProgress = {}, dailyStreak = 0 }) {
  const [activeCat, setActiveCat] = useState('all')

  const filtered = activeCat === 'all' ? MODES : MODES.filter(m => m.category === activeCat)

  return (
    <div className="home-overlay">
      <div className="home-content">

        <div className="home-brand">
          <div className="home-logo">🌐</div>
          <h1 className="home-title">Orbis</h1>
          <p className="home-tagline">Test your world geography</p>
        </div>

        <DailyChallengeHub
          progress={dailyProgress}
          streak={dailyStreak}
          onSelectMode={onSelectMode}
        />

        {/* Quiz Hub banner */}
        <button className="home-quiz-hub-banner" onClick={onEnterQuiz}>
          <div className="hqhb-left">
            <span className="hqhb-icon">🎯</span>
            <div className="hqhb-text">
              <span className="hqhb-title">Quiz Hub</span>
              <span className="hqhb-desc">10 quizzes · No globe needed · Flags, Capitals, Scramble &amp; more</span>
            </div>
          </div>
          <span className="hqhb-arrow">›</span>
        </button>

        <div className="home-section-label">🌍 Globe Games</div>

        <div className="home-cat-tabs">
          {Object.keys(CAT_LABELS).map(cat => (
            <button
              key={cat}
              className={`home-cat-tab${activeCat === cat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="home-modes-grid">
          {filtered.map(item => {
            const col = CAT_COLORS[item.category]
            return (
              <button
                key={item.id}
                className="home-mode-card"
                onClick={() => onSelectMode(item.id)}
                style={{ '--card-bg': col.bg, '--card-border': col.border }}
              >
                <div className="home-mode-icon-wrap">
                  <span className="home-mode-icon">{item.icon}</span>
                </div>
                <span className="home-mode-name">{item.label}</span>
                <span className="home-mode-desc">{item.desc}</span>
              </button>
            )
          })}
        </div>

        <div className="home-footer">
          <button className="home-enter-btn" onClick={onEnter}>
            Explore Globe →
          </button>
        </div>

      </div>
    </div>
  )
}
