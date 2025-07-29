import { Router } from 'express'
import { conversationController } from '@/controllers'
import { requireLogin } from '@/middlewares'

const router = Router()

router.post('/', conversationController.create)
router.get('/:conversationId', conversationController.resume)
router.put('/:conversationId', requireLogin, conversationController.update)
router.delete('/:conversationId', requireLogin, conversationController.remove)

export default router
