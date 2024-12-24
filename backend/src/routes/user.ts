import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>().basePath('user')

user.post('signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
            name: body.name
        }
    })

    return c.text('user signup')
})

user.post('signin', async (c) => {
    return c.text('user signin')
})

export default user