import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    Respond with valid JSON only. No markdown, no explanation outside the JSON.`;

    try {
        const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }],
        });

        const raw = response.content[0].text.trim();
        const parsed = JSON.parse(raw);

        if (!parsed.useCase || !parsed.requiredLevel) {
            throw new Error("Invalid classifier response");
        }

        return parsed;

    } catch (error) {
        console.error("Classifier failed, using fallback:", error.message);
        return {
            useCase: "mixed",
            requiredLevel: 2,
            reasoning: "Could not classify — defaulting to mixed use case at level 2"
        };
    }
}

export default classifyUseCaseAndLevel;