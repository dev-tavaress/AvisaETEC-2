import { getInitials } from '../../utils/getInitials'

export function UserProfileCard({ user }) {
  const displayName = user.name || 'Usuário autenticado'

  return (
    <section className="user-profile-card" aria-label="Perfil acadêmico">
      {user.photoUrl ? (
        <img className="user-profile-photo" src={user.photoUrl} alt={`Foto de ${displayName}`} />
      ) : (
        <span className="user-profile-photo user-profile-initials" aria-hidden="true">
          {getInitials(displayName)}
        </span>
      )}
      <div className="user-profile-content">
        <p className="eyebrow">Perfil acadêmico</p>
        <h2>{displayName}</h2>
        <div className="user-profile-details">
          <span>
            <strong>Módulo</strong>
            {user.module || 'Não informado'}
          </span>
          <span>
            <strong>RA</strong>
            {user.ra || 'Não informado'}
          </span>
          <span>
            <strong>Perfil</strong>
            {user.role || 'Não informado'}
          </span>
        </div>
      </div>
    </section>
  )
}
