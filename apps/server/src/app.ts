import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import routes from './routes'
import { Spark } from './Spark'

const app = express()

const PORT = process.env.PORT || '8080'
const isDev = process.env.NODE_ENV === 'development'

app.use(express.static('public'))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET || 'No secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
}))

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
