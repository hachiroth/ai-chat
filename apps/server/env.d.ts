import type { Session } from 'express-session'
import type { Spark } from '@/Spark'

declare module 'express-session' {
  interface Session {
    uid: string
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: 'development' | 'production' | 'test'
      SECRET: string
      SPARK_ID: string
      SPARK_SECRET: string
      SPARK_KEY: string
      MONGO_URI: string
      SPARK_API_PASSWORD: string
    }
  }

  namespace Express {
    interface Request {
      session: Session
    }
    interface Response {}
    interface Application {}
    interface Locals {
      spark: Spark
    }
  }
}
