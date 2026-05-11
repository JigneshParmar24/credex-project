import { TOOLS_DATA } from '../utils/toolsData.js'

function evaluateAudit(toolInputs, classification) {
  const { useCase, requiredLevel } = classification
  const results = []
  let totalMonthlySavings = 0

  for (const input of toolInputs) {
    const { toolId, planId, seats, monthlySpend } = input
    const tool = TOOLS_DATA[toolId]

    if (!tool) continue

    const currentPlan = tool.plans[planId]
    if (!currentPlan) continue

    const result = {
      toolId,
      toolName: tool.name,
      currentPlan: planId,
      currentSpend: monthlySpend,
      seats,
      recommendations: [],
      savings: 0,
      status: "optimal" 
    }

    if (currentPlan.minSeats && seats < currentPlan.minSeats) {
      const ghostSeats = currentPlan.minSeats - seats
      const wastedSpend = ghostSeats * currentPlan.price

      result.recommendations.push({
        type: "seat_waste",
        message: `You have ${ghostSeats} unused seat(s) on ${tool.name} ${planId}. You're paying for ${currentPlan.minSeats} minimum but only using ${seats}.`,
        saving: wastedSpend
      })
      result.savings += wastedSpend
    }

    let bestDowngrade = null

    for (const [pid, plan] of Object.entries(tool.plans)) {
      if (pid === planId) continue
      if (plan.price === null) continue 
      if (plan.price >= (currentPlan.price ?? Infinity)) continue 
      if (plan.maxSeats !== null && plan.maxSeats < seats) continue 
      if (plan.minSeats && seats < plan.minSeats) continue 
      if (plan.level < requiredLevel) continue 
      if (!bestDowngrade || plan.level > bestDowngrade.plan.level) {
        bestDowngrade = { pid, plan }
      }
    }

    if (bestDowngrade) {
      const saving = (currentPlan.price - bestDowngrade.plan.price) * seats

      result.recommendations.push({
        type: "plan_downgrade",
        message: `Switch from ${tool.name} ${planId} to ${bestDowngrade.pid} — same capability for your needs (level ${bestDowngrade.plan.level} vs required ${requiredLevel}), saves $${saving}/mo per ${seats} seat(s).`,
        saving,
        suggestedPlan: bestDowngrade.pid
      })
      result.savings += saving
    }

    const isWrongCategory = !currentPlan.bestFor.includes(useCase)
    const alternatives = tool.alternatives[useCase] || []

    if (isWrongCategory && alternatives.length > 0) {
      for (const altId of alternatives) {
        const altTool = TOOLS_DATA[altId]
        if (!altTool) continue

        let bestAltPlan = null
        for (const [pid, plan] of Object.entries(altTool.plans)) {
          if (plan.price === null) continue
          if (plan.level < requiredLevel) continue
          if (plan.maxSeats !== null && plan.maxSeats < seats) continue
          if (plan.minSeats && seats < plan.minSeats) continue

          if (!bestAltPlan || plan.price < bestAltPlan.plan.price) {
            bestAltPlan = { pid, plan }
          }
        }

        if (!bestAltPlan) continue

        const altTotalCost = bestAltPlan.plan.price * seats
        const saving = monthlySpend - altTotalCost

        if (saving > 0) {
          result.recommendations.push({
            type: "wrong_tool",
            message: `${tool.name} is optimized for ${tool.category} but your use case is ${useCase}. ${altTool.name} ${bestAltPlan.pid} is a better fit at $${altTotalCost}/mo vs your current $${monthlySpend}/mo.`,
            saving,
            suggestedTool: altId,
            suggestedPlan: bestAltPlan.pid
          })
          result.savings += saving
          break 
        }
      }
    }

    if (monthlySpend > 500) {
      result.credexOpportunity = true
    }

    if (result.recommendations.length === 0) {
      result.status = "optimal"
      result.message = "You're spending well on this tool."
    } else {
      result.status = "overspending"
    }

    totalMonthlySavings += result.savings
    results.push(result)
  }

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    hasCredexOpportunity: totalMonthlySavings > 500,
    classification
  }
}

export default evaluateAudit;