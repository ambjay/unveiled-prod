import { getUserPredictions, createPrediction, getTasteProfile, getPlatformConnections } from "./database"

const QLOO_API_URL = process.env.QLOO_API_URL || "https://api.qloo.com/v1"
const QLOO_API_KEY = process.env.QLOO_API_KEY

interface QlooResponse {
  results: any[]
  metadata: any
}

interface TasteProfile {
  platforms: string[]
  preferences: {
    music: any[]
    gaming: any[]
    video: any[]
    social: any[]
  }
  predictions: any[]
  influences: any[]
}

interface Prediction {
  id: string
  entity_name: string
  entity_type: string
  confidence_score: number
  predicted_timeframe: string
  reasoning: string
}

// Helper function to make Qloo API calls
async function callQlooAPI(endpoint: string, data: any): Promise<QlooResponse> {
  if (!QLOO_API_KEY || !QLOO_API_URL) {
    console.warn("Qloo API not configured, using fallback data")
    throw new Error("Qloo API not configured")
  }

  try {
    const response = await fetch(`${QLOO_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${QLOO_API_KEY}`,
        "X-API-Key": QLOO_API_KEY,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Qloo API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Qloo API call failed:", error)
    throw error
  }
}

export async function getUserTasteProfile(userId: string): Promise<TasteProfile> {
  try {
    const [profiles, platformConnections, predictions] = await Promise.all([
      getTasteProfile(userId),
      getPlatformConnections(userId),
      getUserPredictions(userId, 10),
    ])

    const platforms = platformConnections.map((conn: any) => conn.platform_name)

    // Organize taste data by category
    const preferences = {
      music: profiles.filter((p: any) => p.category === "music").map((p: any) => p.data),
      gaming: profiles.filter((p: any) => p.category === "gaming").map((p: any) => p.data),
      video: profiles.filter((p: any) => p.category === "video").map((p: any) => p.data),
      social: profiles.filter((p: any) => p.category === "social").map((p: any) => p.data),
    }

    // ONLY use Qloo for taste intelligence
    let influences = []
    if (QLOO_API_KEY && preferences.music.length > 0) {
      try {
        const qlooResponse = await callQlooAPI("/taste/influences", {
          user_data: preferences,
          platforms: platforms,
        })
        influences = qlooResponse.results || []
      } catch (error) {
        console.error("Qloo API error:", error)
        // Don't fallback - Qloo is required for taste intelligence
      }
    }

    return {
      platforms,
      preferences,
      predictions,
      influences,
    }
  } catch (error) {
    console.error("Error fetching taste profile:", error)
    return {
      platforms: [],
      preferences: { music: [], gaming: [], video: [], social: [] },
      predictions: [],
      influences: [],
    }
  }
}

export async function getPredictions(userId: string): Promise<Prediction[]> {
  try {
    const predictions = await getUserPredictions(userId)
    return predictions.map((p: any) => ({
      id: p.id.toString(),
      entity_name: p.entity_name,
      entity_type: p.entity_type,
      confidence_score: Number.parseFloat(p.confidence_score),
      predicted_timeframe: p.predicted_timeframe,
      reasoning: p.reasoning,
    }))
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return []
  }
}

export async function generateQlooPredictions(userId: string) {
  if (!QLOO_API_KEY) {
    throw new Error("Qloo API is required for taste predictions. Please configure QLOO_API_KEY.")
  }

  try {
    const tasteProfile = await getUserTasteProfile(userId)

    // Use Qloo API for predictions - this is the core engine
    const qlooResponse = await callQlooAPI("/recommendations", {
      user_profile: {
        platforms: tasteProfile.platforms,
        preferences: tasteProfile.preferences,
      },
      recommendation_types: ["music", "video", "gaming", "books"],
      count: 5,
      include_reasoning: true,
    })

    // Save Qloo predictions to database
    for (const result of qlooResponse.results) {
      await createPrediction(
        userId,
        result.entity.name,
        result.entity.type,
        result.confidence_score,
        result.predicted_timeframe || "Next 2 weeks",
        result.reasoning || "Based on your taste profile analysis",
        result.entity,
        "qloo",
        result.id,
      )
    }

    return qlooResponse.results
  } catch (error) {
    console.error("Error generating Qloo predictions:", error)
    throw new Error("Taste predictions require Qloo integration. Please ensure Qloo API is properly configured.")
  }
}

export async function analyzeInfluences(userId: string) {
  try {
    const tasteProfile = await getUserTasteProfile(userId)

    if (!QLOO_API_KEY) {
      return [] // Return empty if no Qloo access
    }

    const qlooResponse = await callQlooAPI("/taste/influences", {
      user_profile: tasteProfile.preferences,
      analysis_depth: "deep",
      include_cultural_context: true,
    })

    return qlooResponse.results || []
  } catch (error) {
    console.error("Error analyzing influences:", error)
    return []
  }
}

export async function generateHistoricalTaste(userId: string, era: string) {
  try {
    const tasteProfile = await getUserTasteProfile(userId)

    if (QLOO_API_KEY) {
      // Use Qloo for historical analysis
      const qlooResponse = await callQlooAPI("/taste/historical", {
        user_profile: tasteProfile.preferences,
        target_era: era,
        include_cultural_context: true,
      })

      return qlooResponse.results
    }

    // Fallback to Groq
    const { generateObject } = await import("ai")
    const { groq } = await import("@ai-sdk/groq")
    const { z } = await import("zod")

    const HistoricalTasteSchema = z.object({
      music: z.array(z.string()),
      entertainment: z.array(z.string()),
      culture: z.array(z.string()),
      reasoning: z.string(),
    })

    const result = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are a cultural time machine. Based on the user's current taste profile, predict what they would have loved in the ${era}.

User's current taste: ${JSON.stringify(tasteProfile, null, 2)}

Consider:
- Musical genres and artists popular in ${era}
- Entertainment and media from that time
- Cultural movements and trends
- How their current preferences would translate to that era's options

Be specific with actual artists, songs, shows, and cultural phenomena from ${era}.`,
      prompt: `Based on this user's taste DNA, what would they have loved in the ${era}? Provide specific examples.`,
      schema: HistoricalTasteSchema,
    })

    return result.object
  } catch (error) {
    console.error("Error generating historical taste:", error)
    return {
      music: [],
      entertainment: [],
      culture: [],
      reasoning: "Unable to generate historical projection at this time.",
    }
  }
}

export async function getSerendipityRecommendation(userId: string) {
  try {
    const tasteProfile = await getUserTasteProfile(userId)

    if (QLOO_API_KEY) {
      // Use Qloo for serendipity
      const qlooResponse = await callQlooAPI("/recommendations/serendipity", {
        user_profile: tasteProfile.preferences,
        surprise_factor: 0.7, // Balance between familiar and unexpected
        include_reasoning: true,
      })

      if (qlooResponse.results && qlooResponse.results.length > 0) {
        return qlooResponse.results[0]
      }
    }

    // Fallback to existing serendipity API
    const response = await fetch(`/api/serendipity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      return await response.json()
    }

    // Final fallback
    return {
      id: Math.random().toString(36),
      title: "Boards of Canada - Music Has the Right to Children",
      type: "Album",
      reasoning:
        "An ambient electronic masterpiece that creates nostalgic atmospheres - perfect for expanding your sonic horizons.",
      confidence: 0.82,
      platform: "Spotify",
    }
  } catch (error) {
    console.error("Error getting serendipity recommendation:", error)
    return null
  }
}
