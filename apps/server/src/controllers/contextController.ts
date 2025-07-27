import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { Context } from '@/models'

/**
 * Create a new user context.
 */
export const create: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid || null
  const { content, conversationId } = req.body

  const context = await Context.create({ uid, role: 'user', content, conversationId })

  res.json({ ...context.toObject() })
})
