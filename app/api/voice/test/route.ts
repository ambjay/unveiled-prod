import { generateVoice } from "@/lib/elevenlabs-service"

export async function POST(req: Request) {
  try {
    const { voiceId, text } = await req.json()

    if (!voiceId || !text) {
      return new Response("Missing voiceId or text", { status: 400 })
    }

    const audioBuffer = await generateVoice({
      text: text.slice(0, 200), // Limit test text length
      voice_id: voiceId,
    })

    if (!audioBuffer) {
      return new Response("Voice generation failed", { status: 500 })
    }

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error testing voice:", error)
    return new Response("Voice test failed", { status: 500 })
  }
}
