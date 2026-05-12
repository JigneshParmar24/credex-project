import classifyUseCaseAndLevel from '../services/classifier.service.js'
import evaluateAudit from '../services/auditEngine.service.js'
import generateSummary from '../services/summarizer.service.js'

async function runAudit(req, res) {
  try {
    const { tools, description, teamSize } = req.body

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ error: 'tools array is required' })
    }
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'description is required' })
    }

    const toolNames = tools.map(t => t.toolId)

    // Component 1 — classify
    let classification
    try {
      classification = await classifyUseCaseAndLevel(description, toolNames)
      if (!classification.useCase || !classification.requiredLevel) {
        throw new Error("Invalid classification")
      }
    } catch (e) {
      classification = {
        useCase: "mixed",
        requiredLevel: 2,
        reasoning: "Could not classify — defaulting to mixed use case at level 2"
      }
    }

    // Component 2 — evaluate
    const auditResult = evaluateAudit(tools, classification)

    // Component 3 — summarize
    let summaryData
    try {
      summaryData = await generateSummary(auditResult)
    } catch (e) {
      const action = auditResult.totalMonthlySavings > 0
        ? `You could save $${auditResult.totalMonthlySavings}/month by optimizing your plans.`
        : "Your current AI tool spend looks well optimized."
      summaryData = {
        summary: `Based on your ${classification.useCase} workflow, we analyzed your AI stack. ${action}`,
        aiGenerated: false
      }
    }

    return res.json({
      success: true,
      data: {
        ...auditResult,
        summary: summaryData.summary,
        aiGenerated: summaryData.aiGenerated,
        auditId: null // will work after deployment
      }
    })

  } catch (error) {
    console.error('Audit error:', error)
    return res.status(500).json({
      error: 'Audit failed',
      message: error.message
    })
  }
}

export async function getAuditById(req, res) {
  return res.status(503).json({ 
    error: 'Shareable URLs available after deployment' 
  })
}

export default runAudit