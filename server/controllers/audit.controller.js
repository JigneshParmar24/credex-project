import classifyUseCaseAndLevel from '../services/classifier.service.js'
import evaluateAudit from '../services/auditEngine.service.js'

async function runAudit(req, res) {
  try {
    const { tools, description } = req.body

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: 'tools array is required' })
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'description is required' })
    }

    const toolNames = tools.map(t => t.toolId)
    const classification = await classifyUseCaseAndLevel(description, toolNames)

    const auditResult = evaluateAudit(tools, classification)

    return res.json({
      success: true,
      data: auditResult
    })

  } catch (error) {
    console.error('Audit error:', error)
    return res.status(500).json({ error: 'Audit failed', message: error.message })
  }
}

export default runAudit