import { Save, X } from 'lucide-react'

export function EditNoticeModal({ notice, onClose, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    onSubmit({ title: form.title.trim(), message: form.message.trim() })
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-notice-title"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar">
          <X size={17} />
        </button>
        <p className="eyebrow">Gerenciar comunicado</p>
        <h2 id="edit-notice-title">Editar aviso</h2>
        <p className="modal-copy">Atualize o assunto e o corpo da sua mensagem.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Assunto
            <input required name="title" maxLength={120} defaultValue={notice.title} />
          </label>
          <label>
            Mensagem
            <textarea
              required
              name="message"
              maxLength={2000}
              rows={5}
              defaultValue={notice.body}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-button" type="submit">
              <Save size={14} /> Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
