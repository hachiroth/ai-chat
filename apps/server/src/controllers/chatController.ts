import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { ChatMessage, ModelVersion } from 'spark-node-sdk'
import { Context } from '@/models'

/**
 * Chat.
 */
export const chat: RequestHandler = expressAsyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const uid = req.session.uid
  const { conversationId, contextId } = req.params

  const context = await Context.findOne({ uid, conversationId, _id: contextId }).lean()

  const content = (context as any).content

  try {
    const stream = req.app.locals.spark.chatAsStreamAsync(ModelVersion.V1_5, [ChatMessage.fromUser(content)])

    for await (const chunk of stream) {
      if (chunk.uasge) {
        res.write(`event: end\ndata: done\n\n`)
      }
      else {
        res.write(`event: replying\ndata: ${chunk.text}\n\n`)
      }
    }
  }
  catch (error) {
    res.write(`event: error\ndata: ${(error as any).message ?? String(error)}\n\n`)
  }
})
