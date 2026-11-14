import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import noticesRoutes from './routes/notices.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.clientOrigin }))
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
  app.use('/api', authRoutes) // POST /api/auth/login, GET /api/me
  app.use('/api/notices', noticesRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
