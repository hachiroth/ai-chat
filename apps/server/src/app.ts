import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import routes from './routes'
import { Spark } from './Spark'

const app = express()
app.use(express.static('public'))
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET || 'No secret',
  resave: false,
  saveUninitialized: false,
}))

const PORT = process.env.PORT || '8080'
const isDev = process.env.NODE_ENV === 'development'

app.get('/', (_, res) => {
  res.send('Hi, Express!')
})

async function connectMongodb() {
  const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-chat'

  try {
    await mongoose.connect(URI)

    if (isDev) {
      console.debug('🎉 MongoDB connected.')
    }
  }
  catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

app.use(routes({ prefix: '/api' }))

app.locals.spark = new Spark({ apiPassword: process.env.SPARK_API_PASSWORD })

connectMongodb().then(() => {
  app.listen(PORT, () => {
    if (isDev) {
      console.debug(`Server run on port ${PORT}`)
    }
  })
})
