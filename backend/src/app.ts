import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { sequelize } from './database/sequelize.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.FRONTEND_ORIGIN }))
app.use(express.json({ limit: '1mb' }))

app.get('/', (_request, response) => {
  response.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Uganda Business Platform API</title>
  </head>
  <body>
    <main>
      <h1>Uganda Business Platform API</h1>
      <p>The backend is running. Open the frontend to use the platform.</p>
      <ul>
        <li><a href="${env.FRONTEND_ORIGIN}">Open the frontend</a></li>
        <li><a href="/api/health">Check API health</a></li>
      </ul>
    </main>
  </body>
</html>`)
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'uganda-business-platform-api' })
})

app.get('/api/ready', async (_request, response) => {
  try {
    await sequelize.authenticate()
    response.json({ status: 'ready', database: 'connected' })
  } catch {
    response.status(503).json({ status: 'not_ready', database: 'unavailable' })
  }
})

app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  response.status(500).json({ error: 'Internal server error' })
})

export default app
