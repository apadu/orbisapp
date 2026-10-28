/** Compact title bar used at the top of every in-game panel. */
export default function GameHeader({ icon, title, children }) {
  return (
    <div className="gg-panel-header">
      <h2><span>{icon}</span> {title}{children && <span className="gg-panel-header-extra">{children}</span>}</h2>
    </div>
  )
}
