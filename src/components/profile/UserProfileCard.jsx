export function UserProfileCard({ user }) {
  const displayName = user.name || user.fullName || 'Usuário autenticado'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return <section className="user-profile-card" aria-label="Perfil acadêmico">
    {user.photoUrl ? <img className="user-profile-photo" src={user.photoUrl} alt={`Foto de ${displayName}`} /> : <span className="user-profile-photo user-profile-initials" aria-hidden="true">{initials}</span>}
    <div className="user-profile-content">
      <p className="eyebrow">Perfil acadêmico</p>
      <h2>{displayName}</h2>
      <div className="user-profile-details">
        <span><strong>Módulo</strong>{user.module || 'Não informado'}</span>
        <span><strong>RA</strong>{user.ra || 'Não informado'}</span>
        <span><strong>Perfil</strong>{user.role || 'Não informado'}</span>
      </div>
    </div>
  </section>
}
