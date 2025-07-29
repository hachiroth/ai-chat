import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { User } from '@/models'

export const me: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid

  const user = (await User.findById(uid))?.toObject()

  res.json({ ...user })
})
