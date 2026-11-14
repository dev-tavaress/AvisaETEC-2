import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { Server } from 'socket.io'
import { requireAuth, requirePermission, signUser } from './middleware/auth.js'
import { noticesStore, usersStore } from './lib/store.js'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' } })
const port = Number(process.env.PORT || 3001)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.post('/api/auth/login', async (request, response, next) => {
  try {
    const { email, password } = request.body
    if (typeof email !== 'string' || typeof password !== 'string') {
      return response.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
    }

    const users = await usersStore.list()
    const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase())
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!user || !passwordMatches) return response.status(401).json({ error: 'Credenciais inválidas.' })

    const { passwordHash, ...safeUser } = user
    return response.json({ token: signUser(user), user: safeUser })
  } catch (error) {
    return next(error)
  }
})

app.get('/api/me', requireAuth, async (request, response, next) => {
  try {
    const user = (await usersStore.list()).find((candidate) => candidate.id === request.auth.sub)
    if (!user) return response.status(404).json({ error: 'Usuário não encontrado.' })
    const { passwordHash, ...safeUser } = user
    return response.json(safeUser)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/notices', requireAuth, async (_request, response, next) => {
  try {
    return response.json(await noticesStore.list())
  } catch (error) {
    return next(error)
  }
})

app.post('/api/notices', requireAuth, requirePermission('notifications:emit'), async (request, response, next) => {
  try {
    const { title, message, audience } = request.body
    if (![title, message, audience].every((value) => typeof value === 'string' && value.trim())) {
      return response.status(400).json({ error: 'Título, mensagem e destinatários são obrigatórios.' })
    }

    const notice = {
      id: randomUUID(),
      title: title.trim(),
      body: message.trim(),
      audience: audience.trim(),
      authorId: request.auth.sub,
      createdAt: new Date().toISOString(),
    }
    await noticesStore.append(notice)
    io.emit('notice.created', notice)
    return response.status(201).json(notice)
  } catch (error) {
    return next(error)
  }
})

io.on('connection', (socket) => {
  socket.emit('connection.ready', { connectedAt: new Date().toISOString() })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  return response.status(500).json({ error: 'Erro interno do servidor.' })
})

httpServer.listen(port, () => {
  console.log(`AvisaETEC API disponível em http://localhost:${port}`)
})
