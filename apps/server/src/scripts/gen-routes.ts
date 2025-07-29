import fs from 'node:fs'
import path from 'node:path'

const files = fs.readdirSync('src/routes').filter(file =>
  file.endsWith('.ts')
  && file !== 'index.ts',
)

const imports = files.map((file) => {
  const name = path.basename(file, '.ts')
  return `import ${name} from './${name}'`
}).join('\n')

const uses = files.map((file) => {
  const name = path.basename(file, '.ts')
  return `  router.use(\`\${prefix}/${name}\`, ${name})`
}).join('\n')

const content = `import express from 'express'
${imports}

export default ({ prefix = '/api' } = {}) => {
  const router = express.Router()
${uses}
  return router
}
`

fs.writeFileSync('src/routes/index.ts', content)
console.debug('✅ Generated routes/index.ts')
