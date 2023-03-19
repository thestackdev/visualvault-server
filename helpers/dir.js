import fs from 'fs'

export function createDir(path) {
  fs.mkdirSync(path, { recursive: true })
}
