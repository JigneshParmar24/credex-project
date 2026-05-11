import Groq from 'groq-sdk'

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const FALLBACK_RESPONSE = {
  useCase: "mixed",
  requiredLevel: 2,
  reasoning: "Could not classify — defaulting to mixed use case at level 2"
}

async function classifyUseCaseAndLevel(description, tools) {
  const prompt = `You are an AI tool spend analyst. A user has described how their team uses AI tools.

User description: "${description}"
Tools they currently use: ${tools.join(", ")}

Based on this, classify their situation into EXACTLY this JSON format, nothing else:
{
  "useCase": "coding" | "writing" | "research" | "data" | "mixed",
  "requiredLevel": 1 | 2 | 3 | 4,
  "reasoning": "one sentence explanation"
}

Level guide:
1 = Basic tasks, occasional use, simple outputs
2 = Regular daily use, moderate complexity
3 = Heavy use, complex tasks, high output quality needed  
4 = Mission critical, maximum capability required

Respond with valid JSON only. No markdown, no backticks, no explanation outside the JSON.`

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.1
    })

    const raw = response.choices[0].message.content
    console.log("RAW CLASSIFIER RESPONSE:", raw)
    if (!raw) throw new Error("Empty response")

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON found in response")

    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.useCase || !parsed.requiredLevel) {
      throw new Error("Invalid response structure")
    }

    return parsed

  } catch (error) {
    console.error("Classifier failed, using fallback:", error.message)
    return FALLBACK_RESPONSE
  }
}

export default classifyUseCaseAndLevel