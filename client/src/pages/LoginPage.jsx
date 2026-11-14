import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { DEMO_PASSWORD, demoUsers } from '../data/demoUsers'
import { moduleOptions } from '../data/modules'
import { getInitials } from '../utils/getInitials'

export function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', module: moduleOptions[1] })
  const [error, setError] = useState('')
  const isLogin = mode === 'login'

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const toggleMode = () => {
    setMode(isLogin ? 'register' : 'login')
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()

    if (isLogin) {
      const demoUser = demoUsers.find(
        (user) => user.email.toLowerCase() === form.email.trim().toLowerCase(),
      )
      if (!demoUser || form.password !== DEMO_PASSWORD) {
        setError(`E-mail ou senha inválidos. Para demonstração, use a senha ${DEMO_PASSWORD}.`)
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
      module: form.module,
      ra: 'Não informado',
      role: 'Aluno',
      permissions: [],
    })
  }

  const chooseDemo = (demoUser) => {
    setMode('login')
    setForm((current) => ({ ...current, email: demoUser.email, password: DEMO_PASSWORD }))
    setError('')
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark">
            <Check size={20} strokeWidth={3} />
          </span>
          <div>
            <strong>
              Avisa<span>ETEC</span>
            </strong>
            <small>Comunicação escolar</small>
          </div>
        </div>

        <div className="login-heading">
          <div>
            <p className="eyebrow">Acesso seguro</p>
            <h1 id="login-title">
              <strong>{isLogin ? 'Login' : 'Cadastro'}</strong>
            </h1>
          </div>
        </div>

        <p className="login-copy">
          {isLogin
            ? 'Entre com seus dados para acompanhar avisos, calendário e comunicados da ETEC.'
            : 'Preencha seus dados para criar um acesso demonstrativo ao AvisaETEC.'}
        </p>

        <form className="login-form" onSubmit={submit}>
          {!isLogin && (
            <label>
              Nome completo
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Digite seu nome"
                required
              />
            </label>
          )}
          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="voce@etec.sp.gov.br"
              required
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Mínimo de 6 caracteres"
              required
            />
          </label>
          {!isLogin && (
            <label>
              Módulo
              <select name="module" value={form.module} onChange={updateField}>
                {moduleOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="login-actions">
            <button className="primary-button login-submit" type="submit">
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
            <button className="login-secondary-action" type="button" onClick={toggleMode}>
              {isLogin ? 'Cadastrar' : 'Voltar para entrar'}
            </button>
          </div>
        </form>

        {isLogin && (
          <>
            <div className="login-divider">
              <span>ou acesse uma demonstração</span>
            </div>
            <div className="demo-access-list">
              {demoUsers.map((demoUser) => (
                <button
                  className="demo-access-card"
                  type="button"
                  key={demoUser.id}
                  onClick={() => chooseDemo(demoUser)}
                >
                  <span className="avatar demo-avatar">{getInitials(demoUser.name)}</span>
                  <span className="demo-access-content">
                    <strong>{demoUser.role}</strong>
                    <span>{demoUser.name}</span>
                    <small>{demoUser.email}</small>
                  </span>
                  <ArrowRight className="demo-access-arrow" size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        )}

        <p className="demo-disclaimer">
          {isLogin
            ? `Acesso demonstrativo: selecione um perfil acima ou use a senha ${DEMO_PASSWORD}.`
            : 'O cadastro é local e serve apenas para visualizar a experiência do aplicativo.'}
        </p>
      </section>
    </main>
  )
}
