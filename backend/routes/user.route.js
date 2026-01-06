import express from 'express';
import {register,login} from '../controllers/user.controller.js'
import { isAuthenticated } from '../middlewares/isauthenticated.js';

const router=express.Router()
router.post('/register',register)
router.post('/login',login)
export default router;