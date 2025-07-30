import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import routes from './routes'
import { Spark } from './Spark'

(function checkEnvironment() {
  try {
    const { PORT, NODE_ENV, SECRET, SPARK_API_PASSWORD, MONGO_URI, CLIENT_DOMAIN } = process.env
    console.debug('Environment variables:', PORT, NODE_ENV, SECRET, SPARK_API_PASSWORD, MONGO_URI, CLIENT_DOMAIN)
  }
  catch (err) {
    throw new Error(`Miss required environment variable. ${err}`)
  }
})()

const app = express()
const PORT = process.env.PORT
const isDev = process.env.NODE_ENV === 'development'
const devDomains = ['http://localhost:5173', 'http://localhost:4173']

app.use(express.static('public'))
app.use(cors({
  origin: isDev ? [...devDomains, process.env.CLIENT_DOMAIN] : process.env.CLIENT_DOMAIN,
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !isDev,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}))

async function connectMongodb() {
  const URI = process.env.MONGO_URI

  try {
    await mongoose.connect(URI)

    console.debug('🎉 MongoDB connected.')
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
    console.debug(`Server run on port ${PORT}`)
  })
})
