import type { Session } from 'express-session'
import type { SparkClient } from 'spark-node-sdk'

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
    }
  }

  namespace Express {
    interface Request {
      session: Session
    }
    interface Response {}
    interface Locals {}
    interface Application {}
    interface Locals {
      spark: SparkClient
    }
  }
}
