import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const user = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

user.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentUser = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
            name: body.name
        }
    })

    const token = await sign({id: currentUser.id}, c.env.JWT_SECRET)
    console.log('user signup: ', currentUser)
    return c.json({
        jwtToken: token
    })
})

user.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentUser = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    })

    if(!currentUser) {
        c.status(403)
        return c.json({
            message: 'User not found'
        })
    }

    const token = await sign({id: currentUser.id}, c.env.JWT_SECRET)
    console.log('user signin: ', currentUser)
    return c.json({
        jwtToken: token
    })
})

export default user