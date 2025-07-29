import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { Conversation, User } from '@/models'

export const me: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid

  const user = (await User.findById(uid))?.toObject()

  res.json({ ...user })
})

export const getMyConversations: RequestHandler  = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid

  const conversations = await Conversation.find({ uid })

  res.json([...conversations])
})
