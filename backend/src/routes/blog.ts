import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const blog = new Hono<{
    Bindings: {
        JWT_SECRET: string,
        DATABASE_URL: string
    }
}>()

blog.use("/*", authMiddleware)

blog.post('', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentBlog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: c.get('user').id
        }
    })
    
    console.log("blog post: ", currentBlog)

    return c.json({
        id: currentBlog.id,
    })
})

blog.put('', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentBlog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })
    
    console.log("blog updated: ", currentBlog)

    return c.json({
        id: currentBlog.id,
    })
})

blog.get('/:id', async (c) => { 
    const id = c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentBlog = await prisma.post.findFirst({
        where: {
            id
        }
    })

    if (!currentBlog) {
        return c.json({ error: 'Blog not found' }, 404)
    }
    
    console.log("blog: ", currentBlog)

    return c.json({
        id: currentBlog.id,
    })
})

// add pagination

blog.get('/bulk', async (c) => { 
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const currentBlog = await prisma.post.findMany({})

    if (!currentBlog) {
        return c.json({
            error: 'Blogs not found' 
        }, 404)
    }
    
    console.log("blog: ", currentBlog)

    return c.json({
        blogs: currentBlog,
    })
})

export default blog