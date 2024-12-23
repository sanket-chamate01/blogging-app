import api from '../index'

const user = api.basePath('user')

user.post('signup', async (c) => {
    return c.text('user signup')
})

user.post('signin', async (c) => {
    return c.text('user signin')
})

export default user