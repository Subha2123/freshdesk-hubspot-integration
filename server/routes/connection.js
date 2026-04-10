import express from 'express'
import { connectFreshDesk, fetchTickets,getTicketConversations } from '../controller/freshDesk.js';
import { authMiddleware } from '../middleware/auth.js';
import { connectHubSpot,getHubspotConnectMetaData,getHubSpotContacts,hubspotCallback } from '../controller/hubSpot.js';


const router=express.Router()

router.post('/freshdesk',authMiddleware,connectFreshDesk)
router.get('/tickets',authMiddleware,fetchTickets)
router.get('/tickets/conversations/:ticketId', authMiddleware, getTicketConversations);

router.get('/hubspot', authMiddleware, connectHubSpot);
router.get('/hubspot/callback', hubspotCallback);
router.get('/hubspot/contacts', authMiddleware ,getHubSpotContacts)
router.get('/hubspot/metadata', authMiddleware, getHubspotConnectMetaData)



export default router