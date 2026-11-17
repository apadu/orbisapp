import { plain } from '../utils/plain'

/** Compact title bar used at the top of every in-game panel. */
export default function GameHeader({ title, children }) {
  return (
    <div className="gg-panel-header">
      <h2>{plain(title)}{children && <span className="gg-panel-header-extra">{children}</span>}</h2>
    </div>
  )
}
