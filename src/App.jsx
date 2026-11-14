import { useEffect, useMemo, useState } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { EmitNotificationModal } from './components/notices/EmitNotificationModal'
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal'
import { initialNotices } from './data/notices'
import { MuralPage } from './pages/MuralPage'
import { LoginPage } from './pages/LoginPage'
import { useToast } from './hooks/useToast'

function App({ currentUser }) {
  const [user, setUser] = useState(() => currentUser || null)
  const [notices, setNotices] = useState(initialNotices)
  const [view, setView] = useState('mural')
  const [category, setCategory] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dark, setDark] = useState(false)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2025)
  const { message, showToast } = useToast()

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    return () => document.body.classList.remove('dark')
  }, [dark])

  const filteredNotices = useMemo(() => notices.filter((notice) => {
    if (view === 'saved') return notice.favorite
    if (category === 'unread') return notice.unread
    if (category === 'academic') return notice.filters?.includes('academic')
    return category === 'all' || notice.category === category
  }), [category, notices, view])

  const selectView = (nextView) => {
    setView(nextView)
    if (nextView === 'saved') showToast('Avisos salvos serão exibidos aqui')
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateMonth = (amount) => {
    const date = new Date(year, month + amount, 1)
    setMonth(date.getMonth())
    setYear(date.getFullYear())
  }

  const markAsRead = (id) => {
    setNotices((current) => current.map((notice) => notice.id === id ? { ...notice, unread: false } : notice))
    showToast('Aviso marcado como lido')
  }

  const toggleFavorite = (id) => {
    setNotices((current) => current.map((notice) => notice.id === id ? { ...notice, favorite: !notice.favorite } : notice))
  }

  if (!user) return <LoginPage onLogin={setUser} />

  return <div className={`${dark ? 'dark' : ''} min-h-screen`}>
    <div className={`app-shell antialiased ${sidebarOpen ? '' : 'sidebar-collapsed'}`}><Sidebar view={view} activeFilter={view === 'saved' ? 'saved' : category} onViewChange={selectView} onFilter={(nextCategory) => { setView('mural'); setCategory(nextCategory) }} /><main className="main-content min-w-0"><Topbar view={view} dark={dark} sidebarOpen={sidebarOpen} user={user} onMenuToggle={() => setSidebarOpen((current) => !current)} onThemeToggle={() => setDark((current) => !current)} onProfile={() => setProfileModalOpen(true)} onLogout={() => setUser(null)} /><MuralPage user={user} notices={notices} filteredNotices={filteredNotices} onRead={markAsRead} onToggleFavorite={toggleFavorite} onLoadMore={() => showToast('Você já está vendo todos os avisos disponíveis')} month={month} year={year} onMonthChange={updateMonth} canEmitNotification={user?.permissions?.includes('notifications:emit')} onEmitNotification={() => setNotificationModalOpen(true)} /></main></div>
    <BottomNav view={view} onViewChange={selectView} onProfile={() => setProfileModalOpen(true)} />
    {notificationModalOpen && <EmitNotificationModal onClose={() => setNotificationModalOpen(false)} onSubmit={() => { setNotificationModalOpen(false); showToast('Notificação enviada') }} />}
    {profileModalOpen && <ProfileSettingsModal user={user} onClose={() => setProfileModalOpen(false)} onSave={(changes) => { setUser((current) => ({ ...current, ...changes })); setProfileModalOpen(false); showToast('Perfil atualizado') }} />}
    <div className={`toast ${message ? 'visible' : ''}`} role="status">{message}</div>
  </div>
}

export default App
