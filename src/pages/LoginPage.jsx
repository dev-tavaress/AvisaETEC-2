import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { demoUsers } from '../data/demoUsers'

export function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', module: '2º Desenvolvimento de Sistemas' })
  const [error, setError] = useState('')

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    if (mode === 'login') {
      const demoUser = demoUsers.find((user) => user.email.toLowerCase() === form.email.trim().toLowerCase())
      if (!demoUser || form.password !== 'demo123') {
        setError('E-mail ou senha inválidos. Para demonstração, use a senha demo123.')
        return
      }
      onLogin(demoUser)
      return
    }

    if (form.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    onLogin({
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      password: undefined,
      module: form.module,
      ra: 'Não informado',
      role: 'Aluno',
      permissions: [],
    })
  }

  const chooseDemo = (demoUser) => {
    setMode('login')
    setForm((current) => ({ ...current, email: demoUser.email, password: 'demo123' }))
    setError('')
  }

  return <main className="login-page">
    <section className="login-panel" aria-labelledby="login-title">
      <div className="login-brand"><span className="login-brand-mark"><Check size={20} strokeWidth={3} /></span><div><strong>Avisa<span>ETEC</span></strong><small>Comunicação escolar</small></div></div>
      <div className="login-heading"><div><p className="eyebrow">Acesso seguro</p><h1 id="login-title"><strong>{mode === 'login' ? 'Login' : 'Cadastro'}</strong></h1></div></div>
      <p className="login-copy">{mode === 'login' ? 'Entre com seus dados para acompanhar avisos, calendário e comunicados da ETEC.' : 'Preencha seus dados para criar um acesso demonstrativo ao AvisaETEC.'}</p>
      <form className="login-form" onSubmit={submit}>
        {mode === 'register' && <label>Nome completo<input name="name" value={form.name} onChange={updateField} placeholder="Digite seu nome" required /></label>}
        <label>E-mail<input name="email" type="email" value={form.email} onChange={updateField} placeholder="voce@etec.sp.gov.br" required /></label>
        <label>Senha<input name="password" type="password" value={form.password} onChange={updateField} placeholder="Mínimo de 6 caracteres" required /></label>
        {mode === 'register' && <label>Módulo<select name="module" value={form.module} onChange={updateField}><option>1º Desenvolvimento de Sistemas</option><option>2º Desenvolvimento de Sistemas</option><option>Desenvolvimento de Sistemas</option><option>Administração</option></select></label>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="login-actions"><button className="primary-button login-submit" type="submit">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</button><button className="login-secondary-action" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Cadastrar' : 'Voltar para entrar'}</button></div>
      </form>
      {mode === 'login' && <><div className="login-divider"><span>ou acesse uma demonstração</span></div><div className="demo-access-list">
        {demoUsers.map((demoUser) => <button className="demo-access-card" type="button" key={demoUser.id} onClick={() => chooseDemo(demoUser)}>
          <span className="avatar demo-avatar">{demoUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
          <span className="demo-access-content"><strong>{demoUser.role}</strong><span>{demoUser.name}</span><small>{demoUser.email}</small></span>
          <ArrowRight className="demo-access-arrow" size={18} aria-hidden="true" />
        </button>)}
      </div></>}
      <p className="demo-disclaimer">{mode === 'login' ? 'Acesso demonstrativo: selecione um perfil acima ou use a senha demo123.' : 'O cadastro é local e serve apenas para visualizar a experiência do aplicativo.'}</p>
    </section>
  </main>
}
