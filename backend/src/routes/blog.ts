import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const blog = new Hono<{
    Bindings: {
        JWT_SECRET: string,
        DATABASE_URL: string
    },
    Variables: {
        userId: string
    }
}>()

blog.use("/*", authMiddleware)

blog.post('', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
    
        const body = await c.req.json()
    
        const currentBlog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: c.get('userId')
            }
        })
        
        console.log("blog post: ", currentBlog)
    
        return c.json({
            id: currentBlog.id,
        })
    } catch (error) {
        console.error("Error creating blog: ", error)
        c.status(500)
        return c.json({
            error: 'Internal server error'
        })
    }
})

blog.put('', async (c) => {
    try {
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
                published: body.published
            }
        })
        
        console.log("blog updated: ", currentBlog)
    
        return c.json({
            id: currentBlog.id,
        })
    } catch (error) {
        console.error("Error updating blog: ", error)
        c.status(500)
        return c.json({
            error: 'Internal server error'
        })
    }
})

blog.get('/:id', async (c) => { 
    try {
        const id = c.req.param('id')
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

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
            blog: currentBlog,
        })

    } catch (error) {
        console.error("Error fetching blog: ", error)
        c.status(500)
        return c.json({
            error: 'Internal server error'
        })
    }
})

// add pagination

blog.get('/get/bulk', async (c) => {  // somehow when we use /bulk, the control goes to :/id and not /bulk. it considers /bulk as id
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const currentBlog = await prisma.post.findMany()

        if (!currentBlog) {
            c.status(404)
            return c.json({
                error: 'Blogs not found'
            })
        }
        
        console.log("blog: ", currentBlog)

        return c.json({
            blogs: currentBlog,
        })

    } catch (error) {
        console.error("Error fetching blogs: ", error)
        c.status(500)
        return c.json({
            error: 'Internal server error'
        })
    }
})

export default blog