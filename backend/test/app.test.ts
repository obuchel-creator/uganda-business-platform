import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('API foundation', () => {
  it('returns the API health status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      status: 'ok',
      service: 'uganda-business-platform-api',
    })
  })

  it('serves a helpful API landing page', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toContain('Uganda Business Platform API')
    expect(response.text).toContain('/api/health')
  })
})
