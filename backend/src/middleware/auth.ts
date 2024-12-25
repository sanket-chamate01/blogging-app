import { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware: MiddlewareHandler = async (c, next) => { 
    // if (c.req.path === '/bulk') { // ignore /bulk route
    //     return next();
    // }
    const header = c.req.header('Authorization') || ''
    const token = header.split(' ')[1]
    if(!token) {
        c.status(401)
        return c.json({
            message: 'Unauthorized'
        })
    }
    const decoded = await verify(token, c.env.JWT_SECRET)
    if(decoded) {
        c.set('userId', decoded.id);
        console.log('decoded: ', decoded)
        return await next()
    } else {
        c.status(401)
        return c.json({
            message: 'Unauthorized'
        })
    }
}