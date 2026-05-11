import { Router } from 'express'
import runAudit from '../controllers/audit.controller.js'

const router = Router()

router.post('/', runAudit)

export default router