import { LayoutDashboard, Star, UserCircle } from 'lucide-react'

const items = [
  ['mural', LayoutDashboard, 'Mural'],
  ['saved', Star, 'Salvos'],
]

export function BottomNav({ view, onViewChange, onProfile }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação mobile">
      {items.map(([key, Icon, label]) => (
        <button
          key={key}
          className={view === key ? 'active' : ''}
          onClick={() => onViewChange(key)}
        >
          <Icon size={17} />
          {label}
        </button>
      ))}
      <button onClick={onProfile}>
        <UserCircle size={17} />
        Perfil
      </button>
    </nav>
  )
}
