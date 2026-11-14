import http from 'node:http'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { initializeStore } from './lib/store.js'
import { createSocketServer } from './socket.js'

await initializeStore()

const app = createApp()
const httpServer = http.createServer(app)

// Defesa contra conexões lentas (slowloris): cabeçalhos e corpo precisam chegar rápido.
httpServer.headersTimeout = 15_000
httpServer.requestTimeout = 30_000

app.set('io', createSocketServer(httpServer))

httpServer.listen(env.port, () => {
  console.log(`AvisaETEC API disponível em http://localhost:${env.port}`)
})
