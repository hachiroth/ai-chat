import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { User } from '@/models'
import { compare, doHash } from '@/utils/hashing'

export const register: RequestHandler = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body

  const existing = await User.findOne({ username })

  if (existing) {
    res.json({ message: 'Username taken.' })
    return
  }

  const hash = doHash(password)
  const user = (await User.create({ username, password: hash })).toObject()

  delete user.password

  res.status(201).json({ ...user })
})

export const login: RequestHandler = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body

  const existing = (await User.findOne({ username }))?.toObject()

  if (!existing) {
    res.json({ message: 'Username or password incorrect' })
    return
  }

  if (!compare(password, existing!.password!)) {
    res.json({ message: 'Username or password incorrect' })
    return
  }

  req.session.uid = existing._id.toString()

  res.json({ ...existing })
})

export const logout: RequestHandler = expressAsyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ success: true, action: 'logout' })
  })
})
