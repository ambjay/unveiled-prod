import { auth } from "@clerk/nextjs/server"
import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { getUserTasteProfile, getUserPredictions } from "@/lib/qloo-service"
import { saveChatMessage, trackUserEvent } from "@/lib/database"

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  try {
    // Get user's taste profile from Qloo
    const tasteProfile = await getUserTasteProfile(userId)
    const predictions = await getUserPredictions(userId, 10)

    // Track chat interaction
    await trackUserEvent(userId, "geoffrey_chat", {
      message_length: lastMessage.content.length,
      conversation_length: messages.length,
    })

    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"), // Fast conversational interface
      system: `You are Geoffrey, an AI taste assistant with deep knowledge of the user's cultural preferences. You help users understand and explore their Qloo-powered taste predictions and cultural DNA.

IMPORTANT: You do NOT generate predictions. You help users understand their existing Qloo predictions and taste analysis.

User's Qloo Taste Profile:
${JSON.stringify(tasteProfile, null, 2)}

User's Current Predictions from Qloo:
${JSON.stringify(predictions, null, 2)}

Your role:
- Help users understand their Qloo predictions
- Explain why Qloo made certain predictions based on their taste DNA
- Suggest ways to explore predicted content
- Answer questions about their taste evolution
- Provide context about their cultural influences
- Help them discover content through their connected platforms

You are the conversational interface to Qloo's intelligence, not a replacement for it.

Guidelines:
- Reference specific Qloo predictions and confidence scores
- Explain the reasoning behind Qloo's analysis
- Help users understand their taste patterns
- Suggest platform connections to improve predictions
- Be conversational but always ground responses in Qloo data
- If asked for new predictions, explain that you help interpret existing Qloo analysis

Remember: Qloo is the taste intelligence engine. You're the friendly interface that helps users understand and act on that intelligence.`,
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save the conversation to database
    result.text.then(async (fullResponse) => {
      try {
        await saveChatMessage(userId, lastMessage.content, fullResponse, "chat", {
          model: "llama-3.1-70b-versatile",
          qloo_context: tasteProfile,
          predictions_referenced: predictions.length,
        })
      } catch (error) {
        console.error("Error saving chat message:", error)
      }
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in Geoffrey chat:", error)
    return new Response(
      "I'm having trouble accessing your taste profile right now. Please make sure your platforms are connected and Qloo integration is working.",
      { status: 500 },
    )
  }
}
