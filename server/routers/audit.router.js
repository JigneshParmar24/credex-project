import { Router } from 'express'
import runAudit, { getAuditById } from '../controllers/audit.controller.js'
import { auditLimiter } from '../middleware/ratelimiter.middleware.js'

const router = Router()

router.post('/', auditLimiter, runAudit)
// router.get('/:id', getAuditById)
export default router