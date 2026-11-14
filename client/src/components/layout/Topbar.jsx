import { Bell, ChevronLeft, ChevronRight, LogOut, Moon, Sun } from 'lucide-react'
import { getInitials } from '../../utils/getInitials'

export function Topbar({
  view,
  dark,
  sidebarOpen,
  user,
  unreadCount = 0,
  onMenuToggle,
  onThemeToggle,
  onProfile,
  onLogout,
}) {
  const labels = { mural: 'Mural', saved: 'Salvos' }
  return (
    <header className="topbar">
      <button
        className="sidebar-toggle"
        aria-label={sidebarOpen ? 'Ocultar barra lateral' : 'Exibir barra lateral'}
        aria-pressed={sidebarOpen}
        onClick={onMenuToggle}
      >
        <span aria-hidden="true">
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="sidebar-toggle-label">{sidebarOpen ? 'Ocultar menu' : 'Exibir menu'}</span>
      </button>
      <div className="breadcrumb">
        <span>AvisaETEC</span>
        <i>/</i>
        <strong>{labels[view]}</strong>
      </div>
      <div className="top-actions">
        <button className="icon-button notification-button" aria-label="Notificações">
          <Bell size={18} />
          {unreadCount > 0 && <b>{unreadCount}</b>}
        </button>
        <button
          className="icon-button theme-toggle"
          aria-label="Alternar tema"
          onClick={onThemeToggle}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className="profile-button"
          aria-label="Abrir configurações do perfil"
          onClick={onProfile}
        >
          {user.photoUrl ? (
            <img className="top-avatar avatar" src={user.photoUrl} alt="" />
          ) : (
            <span className="top-avatar avatar">{getInitials(user.name)}</span>
          )}
        </button>
        <button className="logout-button" aria-label="Sair do perfil" onClick={onLogout}>
          <LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  )
}
