import http from 'node:http'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { createSocketServer } from './socket.js'

const app = createApp()
const httpServer = http.createServer(app)

app.set('io', createSocketServer(httpServer))

httpServer.listen(env.port, () => {
  console.log(`AvisaETEC API disponível em http://localhost:${env.port}`)
})
