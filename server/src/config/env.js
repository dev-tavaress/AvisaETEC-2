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

export const env = {
  isProduction,
  port: Number(process.env.PORT || 3001),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || developmentSecret,
}
