import { Server } from 'socket.io'
import { env } from './config/env.js'
import { createConnectionLimiter } from './lib/connectionLimiter.js'
import { verifyToken } from './middleware/auth.js'

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin },
    maxHttpBufferSize: 10_000, // o cliente não envia dados; pacotes grandes são abuso
  })

  const allowConnection = createConnectionLimiter({ windowMs: 60_000, limit: 120 })

  // 1) limite de tentativas de conexão por IP
  io.use((socket, next) => {
    if (allowConnection(socket.handshake.address)) return next()
    return next(new Error('Muitas tentativas de conexão. Aguarde um minuto.'))
  })

  // 2) só quem tem um token válido recebe avisos em tempo real.
  // O cliente deve conectar com: io({ auth: { token } })
  io.use((socket, next) => {
    try {
      socket.data.auth = verifyToken(socket.handshake.auth?.token)
      return next()
    } catch {
      return next(new Error('Token de autenticação inválido ou ausente.'))
    }
  })

  io.on('connection', (socket) => {
    socket.emit('connection.ready', { connectedAt: new Date().toISOString() })
  })

  return io
}
