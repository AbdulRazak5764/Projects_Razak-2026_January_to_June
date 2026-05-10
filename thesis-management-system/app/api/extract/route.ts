import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Simple PDF text extraction
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Check if it's a valid PDF
    if (!buffer.toString("utf8", 0, 4).includes("PDF")) {
      throw new Error("Invalid PDF file")
    }

    // Extract text from PDF (basic extraction)
    const text = buffer.toString("latin1")
    const lines = text.split(/[\r\n]+/).filter((line) => line.trim().length > 0)
    const extractedText = lines.slice(0, 100).join(" ")

    return extractedText.slice(0, 8000) // Limit to avoid token overflow
  } catch (error) {
    throw new Error("Failed to extract PDF text")
  }
}

// Use OpenAI API via Vercel AI SDK
async function analyzeWithAI(text: string): Promise<{ abstract: string; keywords: string[] }> {
  try {
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Analyze this research paper text and provide:
1. A concise abstract (2-3 sentences)
2. 5-8 key technical terms/keywords

Format your response as JSON with "abstract" and "keywords" fields.
Paper text:
${text}`,
      temperature: 0.7,
    })

    // Parse the response
    try {
      const parsed = JSON.parse(analysisResult)
      return {
        abstract: parsed.abstract || "Unable to extract abstract",
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ["Research", "Study"],
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const lines = analysisResult.split("\n")
      const abstractLine = lines.find((l) => l.includes("abstract"))
      const keywordsLine = lines.find((l) => l.includes("keywords"))

      return {
        abstract: abstractLine?.slice(abstractLine.indexOf(":") + 1).trim() || text.slice(0, 300),
        keywords: keywordsLine
          ? keywordsLine
              .slice(keywordsLine.indexOf(":") + 1)
              .split(",")
              .map((k) => k.trim())
              .slice(0, 8)
          : ["Research", "Analysis"],
      }
    }
  } catch (error) {
    console.error("AI analysis error:", error)
    // Fallback response if AI fails
    return {
      abstract: text.slice(0, 300) || "Research paper analysis",
      keywords: ["Research", "Study", "Innovation", "Analysis"],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract text from PDF
    const extractedText = await extractPdfText(buffer)

    if (!extractedText) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 })
    }

    // Analyze with OpenAI
    const analysis = await analyzeWithAI(extractedText)

    return NextResponse.json({
      abstract: analysis.abstract,
      keywords: analysis.keywords,
    })
  } catch (error) {
    console.error("Extraction error:", error)
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 })
  }
}
