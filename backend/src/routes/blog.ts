import { Hono } from 'hono'
import { verify } from 'hono/jwt'

const blog = new Hono<{
    Bindings: {
        JWT_SECRET: string
    }
}>()


blog.use("/*", async (c, next) => { 
    const header = c.req.header('Authorization') || ''
    const token = header.split(' ')[1]
    if(!token) {
        c.status(401)
        return c.json({
            message: 'Unauthorized'
        })
    }
    const response = await verify(header, c.env.JWT_SECRET)
    if(response) {
        return next()
    } else {
        c.status(401)
        return c.json({
            message: 'Unauthorized'
        })
    }
})

blog.post('', async (c) => {
    return c.text("blog post")
})

blog.put('', async (c) => {
    return c.text("blog put")
})

blog.get('/:id', async (c) => { 
    const id = c.req.param('id')
    return c.text("blog get")
})

blog.get('/bulk', async (c) => { 
    return c.text("blog get bulk")
})

export default blog