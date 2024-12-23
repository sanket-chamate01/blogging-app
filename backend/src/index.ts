import { Hono } from 'hono'

const app = new Hono()

export const api = new Hono().basePath('/api/v1')

export default app