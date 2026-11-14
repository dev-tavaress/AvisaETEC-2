import { useEffect, useMemo, useState } from 'react'
import { Toast } from './components/common/Toast'
import { BottomNav } from './components/layout/BottomNav'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { EmitNotificationModal } from './components/notices/EmitNotificationModal'
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal'
import { selectedDay } from './data/calendar'
import { initialNotices } from './data/notices'
import { useToast } from './hooks/useToast'
import { LoginPage } from './pages/LoginPage'
import { MuralPage } from './pages/MuralPage'
import { getInitials } from './utils/getInitials'

function App() {
  const [user, setUser] = useState(null)
  const [notices, setNotices] = useState(initialNotices)
  const [view, setView] = useState('mural')
  const [category, setCategory] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dark, setDark] = useState(false)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [month, setMonth] = useState(selectedDay.month)
  const [year, setYear] = useState(selectedDay.year)
  const { message, showToast } = useToast()

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    return () => document.body.classList.remove('dark')
  }, [dark])

  const unreadCount = useMemo(
    () => notices.filter((notice) => notice.unread).length,
    [notices],
  )

  const filteredNotices = useMemo(
    () =>
      notices.filter((notice) => {
        if (view === 'saved') return Boolean(notice.favorite)
        if (category === 'unread') return Boolean(notice.unread)
        if (category === 'academic') {
          return notice.category === 'academic' || notice.filters?.includes('academic')
        }
        return category === 'all' || notice.category === category
      }),
    [category, notices, view],
  )

  const selectView = (nextView) => {
    setView(nextView)
    if (nextView === 'saved') {
      showToast('Exibindo avisos salvos')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectFilter = (nextCategory) => {
    setView('mural')
    setCategory(nextCategory)
  }

  const updateMonth = (amount) => {
    const date = new Date(year, month + amount, 1)
    setMonth(date.getMonth())
    setYear(date.getFullYear())
  }

  const markAsRead = (id) => {
    setNotices((current) =>
      current.map((notice) => (notice.id === id ? { ...notice, unread: false } : notice)),
    )
    showToast('Aviso marcado como lido')
  }

  const toggleFavorite = (id) => {
    setNotices((current) =>
      current.map((notice) =>
        notice.id === id ? { ...notice, favorite: !notice.favorite } : notice,
      ),
    )
  }

  const emitNotice = ({ title, message: body, target, audience }) => {
    const isStudent = audience === 'student'
    const notice = {
      id: Date.now(),
      title,
      body,
      category: isStudent ? 'individual' : 'class',
      label: isStudent ? 'Para mim' : 'Minha turma',
      author: user.name,
      role: `${user.role} · para ${target}`,
      initials: getInitials(user.name),
      time: 'agora',
      unread: false,
      favorite: false,
    }
    setNotices((current) => [notice, ...current])
    setNotificationModalOpen(false)
    showToast('Notificação enviada')
  }

  const saveProfile = (changes) => {
    setUser((current) => ({ ...current, ...changes }))
    setProfileModalOpen(false)
    showToast('Perfil atualizado')
  }

  const logout = () => {
    setUser(null)
    setView('mural')
    setCategory('all')
    setNotificationModalOpen(false)
    setProfileModalOpen(false)
  }

  if (!user) return <LoginPage onLogin={setUser} />

  return (
    <div className={`${dark ? 'dark' : ''} min-h-screen`}>
      <div className={`app-shell antialiased ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Sidebar
          view={view}
          activeFilter={view === 'saved' ? 'saved' : category}
          unreadCount={unreadCount}
          onViewChange={selectView}
          onFilter={selectFilter}
        />
        <main className="main-content min-w-0">
          <Topbar
            view={view}
            dark={dark}
            sidebarOpen={sidebarOpen}
            user={user}
            unreadCount={unreadCount}
            onMenuToggle={() => setSidebarOpen((current) => !current)}
            onThemeToggle={() => setDark((current) => !current)}
            onNotificationsClick={() => selectFilter('unread')}
            onProfile={() => setProfileModalOpen(true)}
            onLogout={logout}
          />
          <MuralPage
            user={user}
            filteredNotices={filteredNotices}
            onRead={markAsRead}
            onToggleFavorite={toggleFavorite}
            onLoadMore={() => showToast('Você já está vendo todos os avisos disponíveis')}
            month={month}
            year={year}
            onMonthChange={updateMonth}
            canEmitNotification={Boolean(user.permissions?.includes('notifications:emit'))}
            onEmitNotification={() => setNotificationModalOpen(true)}
          />
        </main>
      </div>
      <BottomNav
        view={view}
        onViewChange={selectView}
        onProfile={() => setProfileModalOpen(true)}
      />
      {notificationModalOpen && (
        <EmitNotificationModal
          onClose={() => setNotificationModalOpen(false)}
          onSubmit={emitNotice}
        />
      )}
      {profileModalOpen && (
        <ProfileSettingsModal
          user={user}
          onClose={() => setProfileModalOpen(false)}
          onSave={saveProfile}
        />
      )}
      <Toast message={message} />
    </div>
  )
}

export default App