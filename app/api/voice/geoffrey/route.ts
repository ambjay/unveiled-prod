import { auth } from "@clerk/nextjs/server"
import { generateGeoffreyVoice } from "@/lib/elevenlabs-service"
import { trackUserEvent } from "@/lib/database"

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { text } = await req.json()

    if (!text || text.length > 1000) {
      return new Response("Invalid text length", { status: 400 })
    }

    // Track voice generation
    await trackUserEvent(userId, "voice_generation", {
      text_length: text.length,
      service: "elevenlabs",
    })

    const audioBuffer = await generateGeoffreyVoice(text)

    if (!audioBuffer) {
      return new Response("Voice generation not available", { status: 503 })
    }

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating voice:", error)
    return new Response("Voice generation failed", { status: 500 })
  }
}
