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

    try {
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
    }catch(e) {
        c.status(403)
        return c.json({
            message: 'User already exists or Invalid'
        })
    }
})

user.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    try {
        const currentUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })
    
        if(!currentUser) {
            c.status(403)
            return c.json({
                message: 'User not found'
            })
        }

        if(currentUser.password !== body.password) {
            c.status(403)
            return c.json({
                message: 'Invalid Credentials'
            })
        }
    
        const token = await sign({id: currentUser.id}, c.env.JWT_SECRET)
        console.log('user signin: ', currentUser)
        return c.json({
            jwtToken: token
        })
    }catch(e) {
        c.status(403)
        return c.json({
            message: 'An error occurred'
        })
    }
})

export default user