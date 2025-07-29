const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

// Geoffrey's voice configuration - you'll need to set this in environment variables
const GEOFFREY_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" // Default voice

interface VoiceSettings {
  stability: number
  similarity_boost: number
  style?: number
  use_speaker_boost?: boolean
}

interface GenerateVoiceOptions {
  text: string
  voice_id?: string
  voice_settings?: VoiceSettings
}

interface Voice {
  voice_id: string
  name: string
  category: string
  description?: string
  preview_url?: string
}

// Geoffrey's optimized voice settings
const GEOFFREY_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.75,
  similarity_boost: 0.85,
  style: 0.2,
  use_speaker_boost: true,
}

export async function generateVoice(options: GenerateVoiceOptions): Promise<ArrayBuffer | null> {
  if (!ELEVENLABS_API_KEY) {
    console.warn("ElevenLabs API key not configured")
    return null
  }

  const voiceId = options.voice_id || GEOFFREY_VOICE_ID

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: options.text,
        voice_settings: options.voice_settings || GEOFFREY_VOICE_SETTINGS,
        model_id: "eleven_monolingual_v1",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error("Error generating voice:", error)
    return null
  }
}

export async function getAvailableVoices(): Promise<Voice[]> {
  if (!ELEVENLABS_API_KEY) {
    return []
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error("Error fetching voices:", error)
    return []
  }
}

export async function generateGeoffreyVoice(text: string): Promise<ArrayBuffer | null> {
  return generateVoice({
    text,
    voice_id: GEOFFREY_VOICE_ID,
    voice_settings: GEOFFREY_VOICE_SETTINGS,
  })
}

// Get voice info for setup
export async function getVoiceInfo(voiceId: string) {
  if (!ELEVENLABS_API_KEY) {
    return null
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching voice info:", error)
    return null
  }
}

// Check if voice features are available
export function isVoiceEnabled(): boolean {
  return !!(ELEVENLABS_API_KEY && GEOFFREY_VOICE_ID)
}

// Get the configured Geoffrey voice ID
export function getGeoffreyVoiceId(): string {
  return GEOFFREY_VOICE_ID
}

// Popular voice IDs for reference (users can choose from these)
export const POPULAR_VOICES = {
  // Male voices
  ADAM: "pNInz6obpgDQGcFmaJgB", // Deep, authoritative
  ANTONI: "ErXwobaYiN019PkySvjV", // Well-balanced, versatile
  ARNOLD: "VR6AewLTigWG4xSOukaG", // Strong, confident
  JOSH: "TxGEqnHWrfWFTfGW9XjX", // Light, friendly
  SAM: "yoZ06aMxZJJ28mfd3POQ", // Casual, conversational

  // Female voices
  BELLA: "EXAVITQu4vr4xnSDxMaL", // Sweet, gentle
  DOMI: "AZnzlk1XvdvUeBnXmlld", // Strong, confident
  ELI: "MF3mGyEYCl7XYWbV9V6O", // Young, energetic
  FREYA: "jsCqWAovK2LkecY7zXl4", // Pleasant, clear
  GRACE: "oWAxZDx7w5VEj9dCyTzz", // Warm, professional
}
