import { useState } from 'react'
import { GraduationCap, Send, UserRound, X } from 'lucide-react'

const modules = ['1º Módulo — Desenv. de Sistemas (Tarde)', '2º Módulo — Desenv. de Sistemas (Noite)', 'Administração — Manhã']
const students = ['Beatriz Almeida — RA 2025001842', 'Lucas Oliveira — RA 2025001931', 'Mariana Santos — RA 2025002077']

export function EmitNotificationModal({ onClose, onSubmit }) {
  const [audience, setAudience] = useState('module')

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="notification-modal-title">
      <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={17} /></button>
      <p className="eyebrow">Comunicação institucional</p>
      <h2 id="notification-modal-title">Emitir notificação</h2>
      <p className="modal-copy">Escolha os destinatários e escreva uma comunicação para a comunidade escolar.</p>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(Object.fromEntries(new FormData(event.currentTarget))) }}>
        <label>Assunto <span className="required-mark">*</span><input required name="title" maxLength="120" placeholder="Exemplo: Alteração de sala" /></label>
        <fieldset className="audience-field"><legend>Destinatários <span className="required-mark">*</span></legend><div className="audience-switch"><button type="button" className={audience === 'module' ? 'active' : ''} onClick={() => setAudience('module')}><GraduationCap size={15} /><span>Módulo / Turma</span></button><button type="button" className={audience === 'student' ? 'active' : ''} onClick={() => setAudience('student')}><UserRound size={15} /><span>Aluno individual</span></button></div><select name="target" required defaultValue=""><option value="" disabled>{audience === 'module' ? 'Selecione o módulo ou turma' : 'Selecione o aluno'}</option>{(audience === 'module' ? modules : students).map((option) => <option key={option} value={option}>{option}</option>)}</select></fieldset>
        <label>Mensagem<textarea required name="message" rows="4" placeholder="Escreva o comunicado para os destinatários" /></label>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" type="submit"><Send size={14} /> Enviar notificação</button></div>
      </form>
    </section>
  </div>
}
