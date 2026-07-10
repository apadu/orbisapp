export default function HomePage({ onEnter, onSelectMode }) {
  const MODES = [
    { section: 'Guess' },
    { id: 'mystery',        icon: '🔍', label: 'Mystery Country',   desc: 'Guess the hidden country from distance clues' },
    { id: 'locate',         icon: '📍', label: 'Pinpoint Country',  desc: 'Click the globe to place the named country' },
    { id: 'neighbor',       icon: '📌', label: 'Neighbors',         desc: 'Name all countries that share a border with the highlighted one' },
    { id: 'ooo',            icon: '🤔', label: 'Odd One Out',       desc: 'Four countries — three share something, one doesn\'t. Pick the odd one.' },
    { id: 'missing',        icon: '🗺️', label: 'Blind Map',         desc: 'Name countries on a blank map' },
    { section: 'Name All' },
    { id: 'name-all',            icon: '🌍', label: 'Countries',   desc: 'Name every country in the world against the clock' },
    { id: 'name-all-caps',       icon: '🏙️', label: 'Capitals',    desc: 'Name every capital city you know' },
    { id: 'name-all-currencies', icon: '💰', label: 'Currencies',      desc: 'Type currencies — countries light up as you go' },
    { id: 'name-all-languages',  icon: '🗣️', label: 'Languages',       desc: 'Type languages — countries light up as you go' },
    { id: 'mountains',           icon: '⛰️', label: 'Mountain Ranges', desc: 'Name every major mountain range on the globe' },
    { id: 'name-all-seas',       icon: '🌊', label: 'Seas',            desc: 'Name every ocean and sea — they light up as you go' },
    { section: 'Quiz' },
    { id: 'capital',        icon: '🏛️', label: 'Capitals Quiz',     desc: 'Match countries to their capitals' },
    { id: 'seas',           icon: '🌊', label: 'Seas',              desc: 'Identify oceans and seas on the globe' },
    { id: 'cap-to-country', icon: '🗺️', label: 'Cap to Country',    desc: 'Name the country from its capital city' },
    { id: 'flag',           icon: '🚩', label: 'Flags',             desc: 'Identify countries by their flags' },
    { id: 'border-chain',   icon: '🔗', label: 'Borders',           desc: 'Connect two countries through shared borders' },
    { id: 'pop-order',      icon: '📊', label: 'Population',        desc: 'Rank countries by population size' },
    { id: 'area',           icon: '📏', label: 'Bigger or Smaller', desc: 'Pick which country has a larger land area' },
    { id: 'currency',       icon: '💰', label: 'Currency Quiz',    desc: 'Name the official currency of each country' },
    { id: 'language',       icon: '🗣️', label: 'Language Quiz',    desc: 'Type the official language of each country' },
    { section: 'Explore' },
    { id: 'learn',          icon: '🎓', label: 'Learn',             desc: 'Click any country to see its facts' },
    { id: 'spotlight',      icon: '🔦', label: 'Solo Map',          desc: 'Fill in a blank map at your own pace' },
  ]

  return (
    <div className="home-overlay">
      <div className="home-content">

        <div className="home-brand">
          <div className="home-logo">🌐</div>
          <h1 className="home-title">Orbis</h1>
          <p className="home-tagline">Test your world geography</p>
        </div>

        <div className="home-modes-grid">
          {MODES.map((item, i) =>
            item.section ? (
              <div key={`s-${i}`} className="home-section-label">{item.section}</div>
            ) : (
              <button
                key={item.id}
                className="home-mode-card"
                onClick={() => onSelectMode(item.id)}
              >
                <span className="home-mode-icon">{item.icon}</span>
                <div className="home-mode-info">
                  <span className="home-mode-name">{item.label}</span>
                  <span className="home-mode-desc">{item.desc}</span>
                </div>
              </button>
            )
          )}
        </div>

        <div className="home-footer">
          <button className="home-enter-btn" onClick={onEnter}>
            Start Playing →
          </button>
        </div>

      </div>
    </div>
  )
}
