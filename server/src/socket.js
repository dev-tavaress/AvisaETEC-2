import { Server } from 'socket.io'
import { env } from './config/env.js'
import { verifyToken } from './middleware/auth.js'

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, { cors: { origin: env.clientOrigin } })

  // Só quem tem um token válido recebe avisos em tempo real.
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
