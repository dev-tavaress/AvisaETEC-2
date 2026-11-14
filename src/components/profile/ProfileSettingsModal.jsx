const moduleOptions = ['1º Desenvolvimento de Sistemas', '2º Desenvolvimento de Sistemas', 'Desenvolvimento de Sistemas', 'Administração']

export function ProfileSettingsModal({ user, onClose, onSave }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-settings-title">
      <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={17} /></button>
      <p className="eyebrow">Conta autenticada</p>
      <h2 id="profile-settings-title">Configurações do perfil</h2>
      <p className="modal-copy">Atualize as informações exibidas no seu perfil acadêmico.</p>
      <form onSubmit={(event) => { event.preventDefault(); onSave(Object.fromEntries(new FormData(event.currentTarget))) }}>
        <label>Nome completo<input name="name" defaultValue={user.name || user.fullName || ''} required /></label>
        <div className="modal-form-grid"><label>Módulo<select name="module" defaultValue={user.module || moduleOptions[0]}>{moduleOptions.map((module) => <option key={module}>{module}</option>)}</select></label><label>RA<input name="ra" defaultValue={user.ra || ''} readOnly aria-describedby="ra-help" /></label></div>
        <label>Foto de perfil<input name="photoUrl" type="url" defaultValue={user.photoUrl || ''} placeholder="Opcional: URL da foto" /></label>
        <small id="ra-help" className="field-help">O RA é fornecido pela autenticação da escola.</small>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" type="submit">Salvar alterações</button></div>
      </form>
    </section>
  </div>
}
import { X } from 'lucide-react'
