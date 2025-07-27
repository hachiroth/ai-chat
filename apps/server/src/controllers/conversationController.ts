import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { Conversation } from '@/models'

/**
 * Create a new conversation.
 */
export const create: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session?.uid || null
  const conversation = await Conversation.create({ uid })
  res.json({ ...conversation.toObject() })
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
