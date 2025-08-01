import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { WikipediaRepository } from "@/lib/repositories/wikipedia-repository"
import { ValidationError } from "@/lib/errors/custom-errors"
import type { InterestCategory } from "@/types"

const INTEREST_CATEGORIES = {
  science: ["physics", "chemistry", "biology", "mathematics", "astronomy"],
  technology: ["computer science", "artificial intelligence", "robotics", "internet"],
  history: ["ancient history", "world war", "civilization", "historical figures"],
  art: ["painting", "sculpture", "architecture", "artists"],
  sports: ["football", "basketball", "olympics", "athletes"],
  music: ["classical music", "rock music", "musicians", "instruments"],
  nature: ["animals", "plants", "ecology", "environment"],
  space: ["planets", "stars", "space exploration", "astronomy"],
  food: ["cuisine", "cooking", "nutrition", "restaurants"],
  travel: ["countries", "cities", "landmarks", "tourism"],
  literature: ["novels", "poetry", "authors", "books"],
  philosophy: ["philosophers", "ethics", "logic", "metaphysics"],
}

// Fallback articles for when API fails
const FALLBACK_ARTICLES = [
  {
    title: "Quantum Computing",
    extract:
      "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Quantum_computing",
    pageId: "25652",
  },
  {
    title: "Ancient Rome",
    extract:
      "Ancient Rome was a civilization that began as a city-state on the Italian Peninsula during the 8th century BC and expanded to become one of the largest empires in the ancient world.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Ancient_Rome",
    pageId: "25616",
  },
  {
    title: "Artificial Intelligence",
    extract:
      "Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    pageId: "1386",
  },
  {
    title: "Leonardo da Vinci",
    extract:
      "Leonardo da Vinci was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor and architect.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci",
    pageId: "18079",
  },
  {
    title: "Black Holes",
    extract:
      "A black hole is a region of spacetime where gravity is so strong that nothing, including light or other electromagnetic waves, has enough energy to escape it.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Black_hole",
    pageId: "4146",
  },
]

async function fetchRandomWikipediaArticle(category: string) {
  try {
    // Try to fetch from Wikipedia API with better error handling
    const searchQuery = category.replace(/\s+/g, "+")
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/random/summary`

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "WikipediaReel/1.0 (https://example.com/contact)",
      },
    })

    if (!response.ok) {
      throw new Error(`Wikipedia API returned ${response.status}`)
    }

    const data = await response.json()

    return {
      title: data.title || "Unknown Article",
      extract: data.extract || data.description || "No description available.",
      thumbnail:
        data.thumbnail?.source ||
        `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(data.title || category)}`,
      url:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title || category)}`,
      pageId: data.pageid || Math.random().toString(),
    }
  } catch (error) {
    console.error("Wikipedia API failed, using fallback:", error)

    // Return a random fallback article
    const fallbackArticle = FALLBACK_ARTICLES[Math.floor(Math.random() * FALLBACK_ARTICLES.length)]
    return {
      ...fallbackArticle,
      // Customize the fallback based on category
      thumbnail: `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(category + " " + fallbackArticle.title)}`,
    }
  }
}

async function generateAISummary(title: string, extract: string, topic: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create an engaging, concise summary (2-3 sentences) of this Wikipedia article about "${title}" in the ${topic} category. Make it interesting and accessible:

Original text: ${extract}

Focus on the most fascinating aspects and write in a conversational tone that would engage someone scrolling through a social media feed.`,
      maxTokens: 150,
    })

    return text
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return extract.slice(0, 200) + "..."
  }
}

export async function POST(request: NextRequest) {
  try {
    const { interests, count = 5 } = await request.json()

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      throw new ValidationError("Invalid interests provided")
    }

    const wikipediaRepository = WikipediaRepository.getInstance()
    const articles = await wikipediaRepository.getArticlesByInterests(interests as InterestCategory[], count)

    return NextResponse.json(articles)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error("Error in Wikipedia API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
