import { Hono } from "hono";

const middleware = new Hono()

export const middle = middleware.use(async (c, next) => {
    console.log('middleware')
    return next()
})