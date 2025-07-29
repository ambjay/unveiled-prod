import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { getUserTasteProfile, callQlooAPI } from "@/lib/qloo-service"
import { saveSerendipityRecommendation, trackUserEvent } from "@/lib/database"

const RecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["song", "album", "artist", "movie", "show", "game", "book", "podcast"]),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
  platform: z.string(),
  genre: z.string().optional(),
  year: z.number().optional(),
  preview_url: z.string().optional(),
  external_url: z.string().optional(),
  image_url: z.string().optional(),
})

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    // Get user's taste profile
    const tasteProfile = await getUserTasteProfile(userId)

    // Track serendipity request
    await trackUserEvent(userId, "serendipity_request", {
      platforms_connected: tasteProfile.platforms.length,
      has_predictions: tasteProfile.predictions.length > 0,
    })

    if (!process.env.QLOO_API_KEY) {
      return Response.json(
        { error: "Serendipity requires Qloo integration. Please configure your taste intelligence engine." },
        { status: 503 },
      )
    }

    // Use Qloo API for serendipity - this is the core engine
    const qlooResponse = await callQlooAPI("/recommendations/serendipity", {
      user_profile: {
        platforms: tasteProfile.platforms,
        preferences: tasteProfile.preferences,
      },
      surprise_factor: 0.8, // High surprise for serendipity
      confidence_minimum: 0.6,
      include_reasoning: true,
    })

    if (!qlooResponse.results || qlooResponse.results.length === 0) {
      return Response.json(
        { error: "No serendipitous recommendations available. Try connecting more platforms to improve predictions." },
        { status: 404 },
      )
    }

    const recommendation = qlooResponse.results[0]

    // Save the recommendation to database
    await saveSerendipityRecommendation(userId, recommendation, "qloo-v1.0")

    return Response.json({
      id: recommendation.id || Math.random().toString(36),
      title: recommendation.entity.name,
      type: recommendation.entity.type,
      reasoning: recommendation.reasoning,
      confidence: recommendation.confidence_score,
      platform: recommendation.platform || "Multiple",
      genre: recommendation.entity.genre,
      year: recommendation.entity.year,
      preview_url: recommendation.entity.preview_url,
      external_url: recommendation.entity.external_url,
      image_url: recommendation.entity.image_url,
    })
  } catch (error) {
    console.error("Error generating serendipity recommendation:", error)
    return Response.json(
      { error: "Unable to generate serendipitous recommendations. Please ensure Qloo integration is working." },
      { status: 500 },
    )
  }
}
