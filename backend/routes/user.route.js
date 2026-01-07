import express from 'express';
import {registerUser, loginUser} from '../controllers/user.controller.js'
import {z} from 'zod'
import validate from '../middlewares/validate.js';

const router=express.Router()
const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

router.post('/register', validate(registerSchema), (req, res, next) => {
    registerUser(req, res).catch(next);
});

router.post('/login', validate(loginSchema), (req, res, next) => {
    loginUser(req, res).catch(next);
});
export default router;