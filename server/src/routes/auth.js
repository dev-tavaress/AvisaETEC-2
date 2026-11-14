import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { requireAuth, signUser } from '../middleware/auth.js'
import { usersStore } from '../lib/store.js'

const router = Router()

// Hash descartável: a comparação roda mesmo quando o e-mail não existe, para
// que o tempo de resposta não revele quais e-mails estão cadastrados.
const dummyHash = bcrypt.hashSync('avisaetec-dummy-password', 10)

function toPublicUser({ passwordHash: _passwordHash, ...publicUser }) {
  return publicUser
}

router.post('/auth/login', async (request, response, next) => {
  try {
    const { email, password } = request.body ?? {}
    if (typeof email !== 'string' || typeof password !== 'string') {
      return response.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
    }

    const user = await usersStore.findByEmail(email)
    const passwordMatches = await bcrypt.compare(password, user?.passwordHash ?? dummyHash)
    if (!user || !passwordMatches) {
      return response.status(401).json({ error: 'Credenciais inválidas.' })
    }

    return response.json({ token: signUser(user), user: toPublicUser(user) })
  } catch (error) {
    return next(error)
  }
})

router.get('/me', requireAuth, async (request, response, next) => {
  try {
    const user = await usersStore.findById(request.auth.sub)
    if (!user) return response.status(404).json({ error: 'Usuário não encontrado.' })
    return response.json(toPublicUser(user))
  } catch (error) {
    return next(error)
  }
})

export default router
