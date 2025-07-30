import MongoStore from 'connect-mongo'
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
const allowedOrigins = isDev
  ? [...devDomains, process.env.CLIENT_DOMAIN]
  : [process.env.CLIENT_DOMAIN]

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true)
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error(`CORS policy: Origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 7 * 24 * 60 * 60,
  }),
  cookie: {
    secure: !isDev,
    sameSite: 'none',
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

app.use(routes())

app.locals.spark = new Spark({ apiPassword: process.env.SPARK_API_PASSWORD })

connectMongodb().then(() => {
  app.listen(PORT, () => {
    console.debug(`Server run on port ${PORT}`)
  })
})
