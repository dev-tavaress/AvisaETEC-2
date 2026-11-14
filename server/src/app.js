import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimit.js'
import authRoutes from './routes/auth.js'
import noticesRoutes from './routes/notices.js'

export function createApp() {
  const app = express()

  if (env.trustProxy) app.set('trust proxy', env.trustProxy)

  app.use(helmet({ crossOriginResourcePolicy: false })) // API consumida por outra origem (CORS)
  app.use(cors({ origin: env.clientOrigin }))
  app.use('/api', apiLimiter) // antes do parser: requisições em excesso são recusadas sem custo
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
  app.use('/api', authRoutes) // POST /api/auth/login, GET /api/me
  app.use('/api/notices', noticesRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
