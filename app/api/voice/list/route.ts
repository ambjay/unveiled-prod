import { getAvailableVoices } from "@/lib/elevenlabs-service"

export async function GET() {
  try {
    const voices = await getAvailableVoices()

    return Response.json({
      voices: voices.map((voice) => ({
        voice_id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
      })),
    })
  } catch (error) {
    console.error("Error fetching voices:", error)
    return Response.json({ voices: [] }, { status: 500 })
  }
}
