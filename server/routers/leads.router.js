import { Router } from 'express'
import { captureLead } from '../controllers/leads.controller.js'
import { leadLimiter } from '../middleware/ratelimiter.middleware.js'

const router = Router()

router.post('/', leadLimiter, captureLead)

export default router