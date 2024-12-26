import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const blogSchema = z.object({
    title: z.string(),
    content: z.string(),
    published: z.boolean().optional(),
})

export const updateBlogSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    published: z.boolean().optional(),
})

export const idSchema = z.object({
    id: z.string(),
})