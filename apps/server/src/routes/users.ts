import { Router } from 'express'
import { userController } from '@/controllers'
import { requireLogin } from '@/middlewares'

const router = Router()

router.get('/me', userController.me)
router.get('/:uid/conversations', requireLogin, userController.getMyConversations)

export default router
