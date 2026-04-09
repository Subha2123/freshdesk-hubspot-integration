import express from 'express'
import { triggerTicket , getWebHookLogs } from '../controller/freshDesk.js';
import { authMiddleware } from '../middleware/auth.js';



const router=express.Router()

router.post('/freshdesk',triggerTicket)
router.get('/webhook-logs',getWebHookLogs)

export default router