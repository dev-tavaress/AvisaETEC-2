import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.resolve(currentDirectory, '../../data')

// Fila de escrita: evita que duas requisições simultâneas leiam o mesmo
// estado e uma sobrescreva o aviso da outra.
let writeQueue = Promise.resolve()

function enqueue(task) {
  const run = writeQueue.then(task)
  writeQueue = run.catch(() => {})
  return run
}

async function readCollection(fileName) {
  const contents = await readFile(path.join(dataDirectory, fileName), 'utf8')
  return JSON.parse(contents)
}

// Grava em arquivo temporário e renomeia: o JSON nunca fica pela metade.
async function writeCollection(fileName, collection) {
  await mkdir(dataDirectory, { recursive: true })
  const filePath = path.join(dataDirectory, fileName)
  const temporaryPath = `${filePath}.${process.pid}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(collection, null, 2)}\n`, 'utf8')
  await rename(temporaryPath, filePath)
}

export const usersStore = {
  list: () => readCollection('users.json'),
  findById: async (id) => (await readCollection('users.json')).find((user) => user.id === id),
  findByEmail: async (email) => {
    const normalized = email.trim().toLowerCase()
    return (await readCollection('users.json')).find(
      (user) => user.email.toLowerCase() === normalized,
    )
  },
}

export const noticesStore = {
  list: () => readCollection('notices.json'),
  append: (notice) =>
    enqueue(async () => {
      const notices = await readCollection('notices.json')
      notices.unshift(notice)
      await writeCollection('notices.json', notices)
      return notice
    }),
}
