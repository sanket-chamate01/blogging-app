import { api } from '../index'

const blog = api.basePath('blog')

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