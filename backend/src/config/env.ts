import 'dotenv/config'
import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
  FRONTEND_ORIGIN: z.url().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string().url().refine((value) => {
      const protocol = new URL(value).protocol
      return protocol === 'postgres:' || protocol === 'postgresql:'
    }, 'DATABASE_URL must use the postgres or postgresql protocol').optional(),
  ),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().min(1).max(65_535).default(5432),
  DB_NAME: z.string().default('uganda_business_platform_dev'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
})

export const env = environmentSchema.parse(process.env)
