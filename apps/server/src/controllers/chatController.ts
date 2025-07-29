import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { Context } from '@/models'

/**
 * Chat.
 */
export const chat: RequestHandler = expressAsyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const uid = req.session.uid || null
  const { conversationId, contextId } = req.params

  const context = await Context.findOne<typeof Context>({ uid, conversationId, _id: contextId }).lean()

  if(!context) return
  const content = context!.content

  try {
    const stream = req.app.locals.spark.chat(conversationId, [{
      role: 'user',
      content,
    }])

    let reply = ''
    for await (const chunk of stream) {
      if (chunk === '[DONE]') {
        res.write(`event: end\ndata: [DONE]\n\n`)
        await Context.create({
          uid,
          role: 'assistant',
          content: reply,
          conversationId,
          replyTo: contextId,
        })
        reply = ''
      }
      else {
        reply += chunk
        res.write(`event: replying\ndata: ${chunk}\n\n`)
      }
    }
  }
  catch (error) {
    res.write(`event: error\ndata: ${(error as any).message ?? String(error)}\n\n`)
  }
})
