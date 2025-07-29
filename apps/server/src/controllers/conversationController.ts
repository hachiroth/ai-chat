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
  const {conversationId} = req.params

  const contexts = await Context.find({ conversationId }).lean()

  res.json([ ...contexts ])
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
