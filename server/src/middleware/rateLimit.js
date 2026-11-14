import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { verifyToken } from './auth.js'

const minutes = (amount) => amount * 60 * 1000

function createLimiter({ message, ...options }) {
  return rateLimit({
    standardHeaders: 'draft-7', // envia RateLimit e Retry-After
    legacyHeaders: false,
    handler: (_request, response) => response.status(429).json({ error: message }),
    ...options,
  })
}

// Quem tem token válido é contado por usuário; os demais, por IP.
// Assim vários alunos na mesma rede da escola (mesmo IP) não bloqueiam uns aos outros.
function identify(request) {
  if (request.rateIdentity) return request.rateIdentity

  let identity = { key: `ip:${ipKeyGenerator(request.ip)}`, limit: 120 }
  const authorization = request.headers.authorization
  if (authorization?.startsWith('Bearer ')) {
    try {
      const { sub } = verifyToken(authorization.slice(7))
      identity = { key: `user:${sub}`, limit: 600 }
    } catch {
      // token inválido: continua sendo tratado como anônimo
    }
  }

  request.rateIdentity = identity
  return identity
}

// Limite geral de toda a API (janela de 15 min).
export const apiLimiter = createLimiter({
  windowMs: minutes(15),
  limit: (request) => identify(request).limit,
  keyGenerator: (request) => identify(request).key,
  message: 'Muitas requisições. Aguarde alguns minutos e tente novamente.',
})

// Login: só tentativas que falham contam (login correto não consome o limite).
// Limite por IP contra varredura de várias contas...
export const loginIpLimiter = createLimiter({
  windowMs: minutes(15),
  limit: 50,
  skipSuccessfulRequests: true,
  keyGenerator: (request) => `ip:${ipKeyGenerator(request.ip)}`,
  message: 'Muitas tentativas de login. Aguarde 15 minutos e tente novamente.',
})

// ...e limite por conta contra força bruta distribuída em uma única conta.
export const loginAccountLimiter = createLimiter({
  windowMs: minutes(15),
  limit: 10,
  skipSuccessfulRequests: true,
  keyGenerator: (request) => {
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
    return email ? `account:${email.slice(0, 254)}` : `ip:${ipKeyGenerator(request.ip)}`
  },
  message: 'Muitas tentativas de login para esta conta. Aguarde 15 minutos e tente novamente.',
})

// Emissão de avisos: por usuário autenticado (evita spam de notificações).
export const emitNoticeLimiter = createLimiter({
  windowMs: minutes(10),
  limit: 30,
  keyGenerator: (request) => `user:${request.auth?.sub ?? ipKeyGenerator(request.ip)}`,
  message: 'Muitos avisos enviados em pouco tempo. Aguarde alguns minutos.',
})
