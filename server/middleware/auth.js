import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'avisaetec-development-only-secret')

if (!jwtSecret) throw new Error('JWT_SECRET deve ser configurado em produção.')

export function signUser(user) {
  return jwt.sign({ sub: user.id, permissions: user.permissions, role: user.role }, jwtSecret, { expiresIn: '2h' })
}

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
  if (!token) return response.status(401).json({ error: 'Token de autenticação ausente.' })

  try {
    request.auth = jwt.verify(token, jwtSecret)
    return next()
  } catch {
    return response.status(401).json({ error: 'Token de autenticação inválido ou expirado.' })
  }
}

export function requirePermission(permission) {
  return (request, response, next) => {
    if (!request.auth?.permissions?.includes(permission)) {
      return response.status(403).json({ error: 'Usuário sem permissão para esta operação.' })
    }
    return next()
  }
}
