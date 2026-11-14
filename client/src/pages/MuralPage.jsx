import { Bell, ChevronDown } from 'lucide-react'
import { Calendar } from '../components/calendar/Calendar'
import { NoticeCard } from '../components/notices/NoticeCard'
import { UserProfileCard } from '../components/profile/UserProfileCard'

export function MuralPage({
  user,
  filteredNotices,
  onRead,
  onToggleFavorite,
  canManageNotice,
  onEditNotice,
  onDeleteNotice,
  onLoadMore,
  month,
  year,
  onMonthChange,
  canEmitNotification,
  onEmitNotification,
}) {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            <span className="live-dot" /> Comunicação em tempo real
          </p>
          <h1>Mural de avisos</h1>
          <p className="subtitle">Tudo o que você precisa saber sobre a sua rotina na ETEC.</p>
        </div>
        <button
          className="primary-button create-button notification-action"
          type="button"
          disabled={!canEmitNotification}
          title={
            canEmitNotification
              ? 'Emitir uma notificação'
              : 'Disponível apenas para docentes autorizados'
          }
          onClick={onEmitNotification}
        >
          <Bell size={15} /> Emitir notificação
        </button>
      </section>

      <UserProfileCard user={user} />

      <div className="dashboard-grid">
        <section className="feed-column" aria-labelledby="feed-title">
          <div className="section-toolbar">
            <div>
              <h2 id="feed-title">Avisos recentes</h2>
              <span className="result-count">
                {filteredNotices.length} comunicado{filteredNotices.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
          <div className="notice-list">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onRead={onRead}
                onToggleFavorite={onToggleFavorite}
                canManage={canManageNotice(notice)}
                onEdit={onEditNotice}
                onDelete={onDeleteNotice}
              />
            ))}
          </div>
          {filteredNotices.length === 0 && (
            <div className="empty-state">
              <Bell size={20} />
              <strong>Nenhum aviso encontrado</strong>
              <p>Tente remover os filtros para ver outros avisos.</p>
            </div>
          )}
          <button className="load-more" type="button" onClick={onLoadMore}>
            Carregar avisos anteriores <ChevronDown size={15} />
          </button>
        </section>
        <aside className="right-column">
          <Calendar month={month} year={year} onMonthChange={onMonthChange} />
        </aside>
      </div>
      <footer className="site-footer">
        AvisaETEC é um projeto estudantil desenvolvido para a ETEC. Todos os direitos reservados.
      </footer>
    </div>
  )
}
