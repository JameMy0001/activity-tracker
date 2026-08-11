import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = env('DATABASE_URL') as string
const authToken = env('TURSO_AUTH_TOKEN') as string

const libsql = createClient({ url, authToken })
const adapter = new PrismaLibSql(libsql)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  adapter,
  datasource: {
    url: `${url}?authToken=${authToken}`
  }
})
