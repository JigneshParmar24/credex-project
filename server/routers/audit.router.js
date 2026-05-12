import { Router } from 'express'
import runAudit, { getAuditById } from '../controllers/audit.controller.js'

const router = Router()

router.post('/', runAudit)
router.get('/:id', getAuditById)

export default router