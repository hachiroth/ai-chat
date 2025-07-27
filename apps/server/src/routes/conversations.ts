import { Router } from 'express'
import { conversationController } from '@/controllers'

const router = Router()

router.post('/', conversationController.create)

export default router
