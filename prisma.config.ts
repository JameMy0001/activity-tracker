import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const url = env('DATABASE_URL') as string
const authToken = env('TURSO_AUTH_TOKEN') as string

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `${url}?authToken=${authToken}`
  }
})
