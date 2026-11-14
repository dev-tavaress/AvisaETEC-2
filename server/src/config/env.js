import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// O .env fica na raiz do projeto, independente de onde o comando foi executado.
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
dotenv.config({ path: path.join(rootDirectory, '.env') })

const isProduction = process.env.NODE_ENV === 'production'
const developmentSecret = 'avisaetec-development-only-secret'

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET deve ser configurado em produção.')
}

if (!process.env.JWT_SECRET) {
  console.warn('[aviso] JWT_SECRET não definido: usando segredo de desenvolvimento.')
}

// Número de proxies confiáveis à frente da API (0 = acesso direto).
// Necessário atrás de Nginx/Render/Heroku etc.; sem isso, o rate limit enxerga o IP do proxy.
const trustProxy = Number(process.env.TRUST_PROXY || 0)

export const env = {
  isProduction,
  port: Number(process.env.PORT || 3001),
  trustProxy: Number.isInteger(trustProxy) && trustProxy > 0 ? trustProxy : false,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || developmentSecret,
}
