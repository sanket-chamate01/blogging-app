import { Hono } from 'hono'
import user from './routes/user'
import blog from './routes/blog'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono().basePath('/api/v1')

app.route('/user', user)
app.route('/blog', blog)

export default app