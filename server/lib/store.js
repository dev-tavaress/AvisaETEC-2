import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.resolve(serverDirectory, '../data')

async function readCollection(fileName) {
  const filePath = path.join(dataDirectory, fileName)
  const contents = await readFile(filePath, 'utf8')
  return JSON.parse(contents)
}

async function writeCollection(fileName, collection) {
  await mkdir(dataDirectory, { recursive: true })
  await writeFile(path.join(dataDirectory, fileName), `${JSON.stringify(collection, null, 2)}\n`, 'utf8')
}

export const usersStore = {
  list: () => readCollection('users.json'),
}

export const noticesStore = {
  list: () => readCollection('notices.json'),
  append: async (notice) => {
    const notices = await readCollection('notices.json')
    notices.unshift(notice)
    await writeCollection('notices.json', notices)
    return notice
  },
}
