import { compareSync, hashSync } from 'bcryptjs'

export function doHash(password: string, salt = 12) {
  return hashSync(password, salt)
}

export function compare(password: string, hash: string) {
  return compareSync(password, hash)
}
