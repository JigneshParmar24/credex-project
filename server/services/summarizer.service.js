import Groq from 'groq-sdk'

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

async function generateSummary(auditResult) {
  const { results, totalMonthlySavings, totalAnnualSavings, classification } = auditResult

  const toolBreakdown = results.map(r => {
    if (r.status === 'optimal') return `${r.toolName}: spending optimally`
    return `${r.toolName}: ${r.recommendations.map(rec => rec.message).join('. ')}`
  }).join('\n')

  const prompt = `You are a friendly but direct SaaS spend analyst writing a personalized audit summary.

Audit data:
- Primary use case: ${classification.useCase}
- Required capability level: ${classification.requiredLevel}/4
- Total monthly savings opportunity: $${totalMonthlySavings}
- Total annual savings opportunity: $${totalAnnualSavings}

Per tool findings:
${toolBreakdown}

Write a ~100 word personalized summary paragraph that:
1. Acknowledges what they're using AI for
2. Calls out the biggest savings opportunity specifically  
3. Gives a clear action recommendation
4. Ends with the total savings number

Tone: direct, helpful, like a smart friend who knows finance. No fluff. No bullet points. One paragraph only.`

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    })

    const summary = response.choices[0].message.content
    if (!summary) throw new Error("Empty response")

    return { summary: summary.trim(), aiGenerated: true }

  } catch (error) {
    console.error("Summarizer failed, using fallback:", error.message)

    const action = totalMonthlySavings > 0
      ? `You could save $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) by optimizing your current plans.`
      : "Your current AI tool spend looks well optimized."

    return {
      summary: `Based on your ${classification.useCase} focused workflow, we analyzed your AI tool stack. ${action} Review the recommendations above for specific actions you can take today.`,
      aiGenerated: false
    }
  }
}

export default generateSummary