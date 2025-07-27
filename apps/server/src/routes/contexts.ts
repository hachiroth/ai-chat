import { Router } from 'express'
import { contextController } from '@/controllers'

const router = Router()

router.post('/', contextController.create)

export default router
