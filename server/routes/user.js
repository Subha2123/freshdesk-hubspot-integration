import express from 'express'
import { signupUser, loginUser, googleSignIn,getUserData ,logoutUser } from "../controller/user.js";
import { authMiddleware } from '../middleware/auth.js';


const router=express.Router()

router.post('/signup',signupUser)
router.post('/signin',loginUser)
router.post('/google',googleSignIn)
router.get('/getUser',authMiddleware,getUserData)
router.post('/logout',authMiddleware,logoutUser)


export default router