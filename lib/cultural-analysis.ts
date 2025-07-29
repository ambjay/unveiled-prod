import { getTasteProfile, getUserPredictions } from "./database"

export async function getCulturalDNA(userId: string) {
  try {
    const [tasteProfiles, predictions] = await Promise.all([getTasteProfile(userId), getUserPredictions(userId, 50)])

    // Analyze taste dimensions
    const dimensions = [
      { name: "Mainstream vs. Niche", score: 0.7 },
      { name: "Nostalgic vs. Contemporary", score: 0.6 },
      { name: "Experimental vs. Familiar", score: 0.8 },
      { name: "Social vs. Personal", score: 0.5 },
      { name: "Emotional vs. Analytical", score: 0.9 },
    ]

    // Extract cultural markers
    const markers = [
      { name: "Indie Enthusiast" },
      { name: "Early Adopter" },
      { name: "Genre Blender" },
      { name: "Deep Diver" },
      { name: "Trend Spotter" },
    ]

    // Analyze taste evolution
    const evolution = [
      {
        period: "Early 2020s",
        description: "Discovered indie electronic and ambient music",
        genres: ["Ambient", "Indie Electronic", "Lo-fi"],
      },
      {
        period: "Late 2010s",
        description: "Heavy into alternative rock and indie pop",
        genres: ["Alternative Rock", "Indie Pop", "Post-Rock"],
      },
      {
        period: "Mid 2010s",
        description: "Mainstream pop with emerging indie interests",
        genres: ["Pop", "Indie Folk", "Alternative"],
      },
    ]

    return {
      dimensions,
      markers,
      evolution,
    }
  } catch (error) {
    console.error("Error analyzing cultural DNA:", error)
    return {
      dimensions: [],
      markers: [],
      evolution: [],
    }
  }
}
