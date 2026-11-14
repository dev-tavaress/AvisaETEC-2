import { LayoutDashboard, Star } from 'lucide-react'

const menuItems = [
  ['mural', LayoutDashboard, 'Mural'],
  ['saved', Star, 'Salvos'],
]
const filterItems = [
  ['all', 'dot-slate', 'Todos'],
  ['urgent', 'dot-red', 'Urgentes'],
  ['class', 'dot-blue', 'Minha turma'],
  ['individual', 'dot-purple', 'Para mim'],
  ['unread', 'dot-amber', 'Não lidos'],
  ['academic', 'dot-green', 'Acadêmico'],
]

export function Sidebar({ view, activeFilter, unreadCount = 0, onViewChange, onFilter }) {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3 4 7v5c0 4.7 3.4 7.8 8 9 4.6-1.2 8-4.3 8-9V7l-8-4Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m8.5 12.2 2.5 2.5 4.8-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <strong>
            Avisa<span>ETEC</span>
          </strong>
          <small>Comunicação escolar</small>
        </div>
      </div>
      <div className="sidebar-label">Menu principal</div>
      <nav className="nav-list">
        {menuItems.map(([key, Icon, label]) => (
          <button
            key={key}
            className={`nav-item ${view === key ? 'active' : ''}`}
            onClick={() => onViewChange(key)}
          >
            <Icon className="icon" size={17} />
            {label}
            {key === 'mural' && unreadCount > 0 && <b className="nav-count">{unreadCount}</b>}
          </button>
        ))}
      </nav>
      <div className="sidebar-label side-gap">Filtros rápidos</div>
      <nav className="nav-list">
        {filterItems.map(([key, dot, label]) => (
          <button
            key={key}
            className={`nav-item filter-shortcut ${activeFilter === key ? 'active' : ''}`}
            onClick={() => onFilter(key)}
          >
            <span className={`dot ${dot}`} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
