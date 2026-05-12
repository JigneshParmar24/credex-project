import { sendAuditEmail } from "../services/email.service.js"

export async function captureLead(req, res) {
  try {
    const { email, auditData } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    const emailResult = await sendAuditEmail(email, auditData)

    return res.json({
      success: true,
      emailSent: emailResult.success
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return res.status(500).json({ error: 'Failed to capture lead' })
  }
}