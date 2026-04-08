import express from 'express'
import { connectFreshDesk, fetchTickets,getTicketConversations } from '../controller/freshDesk.js';
import { authMiddleware } from '../middleware/auth.js';
import { connectHubSpot,hubspotCallback } from '../controller/hubSpot.js';


const router=express.Router()

router.get('/freshdesk',authMiddleware,connectFreshDesk)
router.get('/tickets',authMiddleware,fetchTickets)
router.get('/tickets/conversations/:ticketId', authMiddleware, getTicketConversations);

router.get('/connect/hubspot', authMiddleware, connectHubSpot);
router.get('/connect/hubspot/callback', authMiddleware, hubspotCallback);



export default router