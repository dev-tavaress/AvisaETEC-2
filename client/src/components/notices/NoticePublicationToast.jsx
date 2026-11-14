import { Bell, X } from 'lucide-react'

export function NoticePublicationToast({ notice, onClose }) {
  if (!notice) return null

  return (
    <aside className="notice-publication-toast" role="status" aria-live="polite">
      <div className="notice-publication-heading">
        <span>
          <Bell size={14} /> Notificação publicada
        </span>
        <button type="button" onClick={onClose} aria-label="Fechar notificação">
          <X size={15} />
        </button>
      </div>
      <strong>{notice.title}</strong>
      <p>{notice.body}</p>
    </aside>
  )
}
