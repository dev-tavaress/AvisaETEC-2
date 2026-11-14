import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signUser(user) {
  return jwt.sign({ sub: user.id, permissions: user.permissions, role: user.role }, env.jwtSecret, {
    expiresIn: '2h',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
  if (!token) return response.status(401).json({ error: 'Token de autenticação ausente.' })

  try {
    request.auth = verifyToken(token)
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
