import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase not configured. Some features will be limited.")
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Helper function to ensure database connection
function ensureDatabase() {
  if (!supabase) {
    throw new Error("Database not configured. Please connect your Supabase database in Vercel dashboard.")
  }
  return supabase
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const db = ensureDatabase()
    const { data, error } = await db.from("users").select("count").limit(1)
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "table not found" which is expected initially
      throw error
    }
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, message: `Database connection failed: ${error}` }
  }
}

// User management
export async function createUser(
  clerkId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("users")
      .upsert({
        id: clerkId,
        clerk_id: clerkId,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getUserById(userId: string) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Platform connections
export async function getPlatformConnections(userId: string) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("platform_connections")
      .select(`
        platform_name,
        platform_username,
        connected_at,
        last_sync_at,
        is_active,
        connection_data
      `)
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("connected_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching platform connections:", error)
    return []
  }
}

export async function createPlatformConnection(
  userId: string,
  platformName: string,
  platformUserId: string,
  accessToken: string,
  refreshToken?: string,
  platformUsername?: string,
  expiresAt?: Date,
) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("platform_connections")
      .upsert({
        user_id: userId,
        platform_name: platformName,
        platform_user_id: platformUserId,
        platform_username: platformUsername || null,
        access_token: accessToken,
        refresh_token: refreshToken || null,
        token_expires_at: expiresAt?.toISOString() || null,
        connected_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating platform connection:", error)
    throw error
  }
}

// Predictions
export async function getUserPredictions(userId: string, limit = 20) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("predictions")
      .select(`
        id,
        entity_name,
        entity_type,
        entity_metadata,
        confidence_score,
        predicted_timeframe,
        reasoning,
        prediction_source,
        created_at,
        is_viewed,
        user_rating
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return []
  }
}

export async function createPrediction(
  userId: string,
  entityName: string,
  entityType: string,
  confidenceScore: number,
  predictedTimeframe: string,
  reasoning: string,
  entityMetadata: any = {},
  predictionSource = "internal",
  qlooId?: string,
) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("predictions")
      .insert({
        user_id: userId,
        entity_name: entityName,
        entity_type: entityType,
        confidence_score: confidenceScore,
        predicted_timeframe: predictedTimeframe,
        reasoning,
        entity_metadata: entityMetadata,
        prediction_source: predictionSource,
        qloo_prediction_id: qlooId || null,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating prediction:", error)
    throw error
  }
}

// Taste profiles
export async function saveTasteProfile(
  userId: string,
  platform: string,
  category: string,
  data: any,
  confidenceScore = 0.5,
) {
  const db = ensureDatabase()
  try {
    const { data: result, error } = await db
      .from("taste_profiles")
      .upsert({
        user_id: userId,
        platform,
        category,
        data,
        confidence_score: confidenceScore,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return result
  } catch (error) {
    console.error("Error saving taste profile:", error)
    throw error
  }
}

export async function getTasteProfile(userId: string) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("taste_profiles")
      .select("platform, category, data, confidence_score, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching taste profile:", error)
    return []
  }
}

// Chat messages
export async function saveChatMessage(
  userId: string,
  message: string,
  response: string,
  messageType = "chat",
  contextData: any = {},
) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("chat_messages")
      .insert({
        user_id: userId,
        message,
        response,
        message_type: messageType,
        context_data: contextData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving chat message:", error)
    throw error
  }
}

export async function getChatHistory(userId: string, limit = 50) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("chat_messages")
      .select("message, response, message_type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return []
  }
}

// Analytics
export async function trackUserEvent(userId: string, eventType: string, eventData: any = {}, sessionId?: string) {
  const db = ensureDatabase()
  try {
    await db.from("user_analytics").insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      session_id: sessionId || null,
    })
  } catch (error) {
    console.error("Error tracking user event:", error)
    // Don't throw error for analytics - it shouldn't break the app
  }
}

// Serendipity recommendations
export async function saveSerendipityRecommendation(userId: string, recommendation: any, algorithmVersion: string) {
  const db = ensureDatabase()
  try {
    const { data, error } = await db
      .from("serendipity_recommendations")
      .insert({
        user_id: userId,
        recommendation_data: recommendation,
        algorithm_version: algorithmVersion,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving serendipity recommendation:", error)
    throw error
  }
}
