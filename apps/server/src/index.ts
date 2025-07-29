import('dotenv').then(({ config }) => {
  config({ quiet: true })
  import('./app')
})

// import { config } from 'dotenv'

// config({ quiet: true })

// import '@/app'
