import express from 'express'
import { signupUser, loginUser, googleSignIn } from "../controller/user.js";


const router=express.Router()

router.post('/signup',signupUser)
router.post('/signin',loginUser)
router.post('/google',googleSignIn)


export default router