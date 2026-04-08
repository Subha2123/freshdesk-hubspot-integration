import express from 'express'
import { triggerTicket } from '../controller/freshDesk.js';
import { authMiddleware } from '../middleware/auth.js';



const router=express.Router()

router.post('/freshdesk',triggerTicket)

export default router