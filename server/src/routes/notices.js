import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { emitNoticeLimiter } from '../middleware/rateLimit.js'
import { noticesStore } from '../lib/store.js'

const router = Router()

const limits = { title: 120, message: 2000, audience: 120 }

function readField(value, maxLength) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed && trimmed.length <= maxLength ? trimmed : null
}

router.get('/', requireAuth, async (_request, response, next) => {
  try {
    return response.json(await noticesStore.list())
  } catch (error) {
    return next(error)
  }
})

router.post(
  '/',
  requireAuth,
  requirePermission('notifications:emit'),
  emitNoticeLimiter,
  async (request, response, next) => {
    try {
      const { title, message, audience } = request.body ?? {}
      const fields = {
        title: readField(title, limits.title),
        message: readField(message, limits.message),
        audience: readField(audience, limits.audience),
      }

      if (Object.values(fields).some((value) => value === null)) {
        return response.status(400).json({
          error:
            'Título, mensagem e destinatários são obrigatórios e devem respeitar o tamanho máximo.',
        })
      }

      const notice = {
        id: randomUUID(),
        title: fields.title,
        body: fields.message,
        audience: fields.audience,
        authorId: request.auth.sub,
        createdAt: new Date().toISOString(),
      }

      await noticesStore.append(notice)
      request.app.get('io')?.emit('notice.created', notice)
      return response.status(201).json(notice)
    } catch (error) {
      return next(error)
    }
  },
)

export default router
