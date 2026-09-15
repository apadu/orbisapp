const QUIZ_ITEMS = [
  {
    id: 'scramble',
    icon: '🔤',
    label: 'Scramble',
    desc: 'Unscramble the letters to name the country',
    difficulty: 'Medium',
    players: '8.4k plays',
  },
  {
    id: 'flag',
    icon: '🚩',
    label: 'Flags Quiz',
    desc: 'Identify countries from their flags',
    difficulty: 'Easy',
    players: '21k plays',
  },
  {
    id: 'capital',
    icon: '🏛️',
    label: 'Capitals Quiz',
    desc: 'Type the capital city of each country',
    difficulty: 'Medium',
    players: '15k plays',
  },
  {
    id: 'cap-to-country',
    icon: '🗺️',
    label: 'Cap → Country',
    desc: 'Name the country from its capital',
    difficulty: 'Hard',
    players: '6.2k plays',
  },
  {
    id: 'currency',
    icon: '💰',
    label: 'Currency Quiz',
    desc: 'Name the currency used in each country',
    difficulty: 'Hard',
    players: '4.8k plays',
  },
  {
    id: 'language',
    icon: '🗣️',
    label: 'Language Quiz',
    desc: 'Type the official language of each country',
    difficulty: 'Hard',
    players: '5.1k plays',
  },
  {
    id: 'area',
    icon: '📏',
    label: 'Bigger or Smaller',
    desc: 'Pick the country with the larger area',
    difficulty: 'Easy',
    players: '11k plays',
  },
  {
    id: 'pop-order',
    icon: '📊',
    label: 'Population Rank',
    desc: 'Rank three countries by population',
    difficulty: 'Medium',
    players: '9.3k plays',
  },
  {
    id: 'border-chain',
    icon: '🔗',
    label: 'Border Chain',
    desc: 'Connect two countries through shared borders',
    difficulty: 'Hard',
    players: '3.7k plays',
  },
  {
    id: 'ooo',
    icon: '🤔',
    label: 'Odd One Out',
    desc: "Find the country that doesn't fit the group",
    difficulty: 'Medium',
    players: '7.6k plays',
  },
  {
    id: 'missing-vowels',
    icon: '🔡',
    label: 'Missing Vowels',
    desc: 'Fill in the missing vowels to spell the country',
    difficulty: 'Medium',
    players: '5.2k plays',
  },
  {
    id: 'flag-colors',
    icon: '🎨',
    label: 'Flag Colors',
    desc: "Guess the country from its flag's color breakdown",
    difficulty: 'Hard',
    players: '4.1k plays',
  },
  {
    id: 'connections',
    icon: '🧩',
    label: 'Connections',
    desc: 'Group 16 countries into 4 hidden categories',
    difficulty: 'Hard',
    players: '6.8k plays',
  },
  {
    id: 'emoji-quiz',
    icon: '🌍',
    label: 'Country Emoji',
    desc: 'Four emojis represent a country — name it',
    difficulty: 'Medium',
    players: '3.9k plays',
  },
  {
    id: 'country-fact',
    icon: '📖',
    label: 'Country by Fact',
    desc: 'Read a fact and name the country. Reveal hints for fewer points',
    difficulty: 'Hard',
    players: '2.7k plays',
  },
]

const DIFF_COLOR = {
  Easy:   { bg: 'rgba(57,255,20,0.15)',   text: '#39ff14' },
  Medium: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  Hard:   { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444' },
}

export default function QuizHub({ onSelect }) {
  return (
    <div className="quiz-hub">
      <div className="quiz-hub-header">
        <h1 className="quiz-hub-title">🎯 Quiz Hub</h1>
        <p className="quiz-hub-subtitle">
          Pick a quiz — no globe needed. Just you and your geography knowledge.
        </p>
      </div>

      <div className="quiz-hub-grid">
        {QUIZ_ITEMS.map(item => {
          const diff = DIFF_COLOR[item.difficulty]
          return (
            <button
              key={item.id}
              className="quiz-hub-card"
              onClick={() => onSelect(item.id)}
            >
              <div className="qhc-icon">{item.icon}</div>
              <div className="qhc-body">
                <div className="qhc-name">{item.label}</div>
                <div className="qhc-desc">{item.desc}</div>
                <div className="qhc-meta">
                  <span
                    className="qhc-diff"
                    style={{ background: diff.bg, color: diff.text }}
                  >
                    {item.difficulty}
                  </span>
                  <span className="qhc-plays">{item.players}</span>
                </div>
              </div>
              <span className="qhc-arrow">›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
