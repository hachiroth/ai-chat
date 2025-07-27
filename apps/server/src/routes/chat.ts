import { Router } from 'express'
import { chatController } from '@/controllers'

const router = Router()

router.get('/:conversationId/:contextId', chatController.chat)

export default router
