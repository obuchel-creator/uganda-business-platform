import { Sequelize } from 'sequelize'
import { env } from '../config/env.js'

const commonOptions = {
  dialect: 'postgres' as const,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 10_000,
    idle: 10_000,
  },
}

function createSequelize(): Sequelize {
  if (env.DATABASE_URL) {
    const databaseUrl = new URL(env.DATABASE_URL)
    const database = decodeURIComponent(databaseUrl.pathname.replace(/^\//, ''))
    const username = decodeURIComponent(databaseUrl.username)
    const password = decodeURIComponent(databaseUrl.password)

    return new Sequelize(database, username, password, {
      ...commonOptions,
      host: databaseUrl.hostname,
      port: databaseUrl.port ? Number(databaseUrl.port) : 5432,
      dialectOptions: { ssl: { rejectUnauthorized: true } },
    })
  }

  return new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    ...commonOptions,
    host: env.DB_HOST,
    port: env.DB_PORT,
  })
}

export const sequelize = createSequelize()
