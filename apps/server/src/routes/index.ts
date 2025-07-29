import express from 'express'
import auth from './auth'
import chat from './chat'
import contexts from './contexts'
import conversations from './conversations'
import users from './users'

export default ({ prefix = '/api' } = {}) => {
  const router = express.Router()
  router.use(`${prefix}/auth`, auth)
  router.use(`${prefix}/chat`, chat)
  router.use(`${prefix}/contexts`, contexts)
  router.use(`${prefix}/conversations`, conversations)
  router.use(`${prefix}/users`, users)
  return router
}
