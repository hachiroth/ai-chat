import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { Context, Conversation } from '@/models'

/**
 * Create a new conversation.
 */
export const create: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session?.uid || null
  const conversation = await Conversation.create({ uid })
  res.json({ ...conversation.toObject() })
})

export const resume: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session?.uid
  const { conversationId } = req.params

  const contexts = await Context.find({ conversationId }).lean()

  if (contexts[0].uid !== uid) {
    res.status(403).json({ message: 'You have no right to access this conversation' })
    return
  }

  res.json([...contexts])
})

/**
 * Remove all anonymous conversation created last one day.
 */
export async function removeAnonymousConversations() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  await Conversation.deleteMany({
    $and: [
      {
        $or: [
          { uid: { $exists: false } },
          { uid: null },
          { uid: '' },
        ],
      },
      { createdAt: { $lt: oneDayAgo } },
    ],
  })
}

export const update: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid
  const { conversationId } = req.params
  const { title } = req.body

  const conversation = await Conversation.findByIdAndUpdate({ uid, _id: conversationId }, { title }, { new: true })

  res.json({ ...conversation })
})

export const remove: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid
  const { conversationId } = req.params

  await Context.deleteMany({ conversationId })

  const result = await Conversation.deleteOne({ _id: conversationId, uid })

  res.json({ success: result.deletedCount > 0 })
})
