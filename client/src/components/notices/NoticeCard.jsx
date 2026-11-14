import { Check, Star } from 'lucide-react'
import { categoryClasses } from '../../data/notices'

export function NoticeCard({ notice, onRead, onToggleFavorite }) {
  return (
    <article className={`notice-card ${notice.unread ? 'unread' : ''}`}>
      <div className="notice-top">
        <div>
          <span className={`badge ${categoryClasses[notice.category]}`}>{notice.label}</span>
          <h3 className="notice-title">
            {notice.unread && <span className="unread-mark" />}
            {notice.title}
          </h3>
        </div>
        <div className="notice-meta">
          <span>{notice.time}</span>
          <button
            className={`favorite-button ${notice.favorite ? 'active' : ''}`}
            aria-label={notice.favorite ? 'Remover dos salvos' : 'Salvar aviso'}
            aria-pressed={notice.favorite}
            onClick={() => onToggleFavorite(notice.id)}
          >
            <Star size={15} fill={notice.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p className="notice-body">{notice.body}</p>
      <div className="notice-footer">
        <div className="notice-author">
          <span className="avatar">{notice.initials}</span>
          <span>
            <strong>{notice.author}</strong>
            <small>{notice.role}</small>
          </span>
        </div>
        {notice.unread ? (
          <button className="read-button" onClick={() => onRead(notice.id)}>
            <Check size={13} /> Marcar como lido
          </button>
        ) : (
          <span className="read-button read">
            <Check size={13} /> Lido
          </span>
        )}
      </div>
    </article>
  )
}
