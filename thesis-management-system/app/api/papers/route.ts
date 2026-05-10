import { type NextRequest, NextResponse } from "next/server"

// In-memory database for demo (use MongoDB in production)
let papersDatabase: any[] = []

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from MongoDB:
    // const papers = await Paper.find({ userId }).lean()

    // For demo, return papers from memory
    return NextResponse.json(papersDatabase)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const abstract = formData.get("abstract") as string
    const keywordsStr = formData.get("keywords") as string

    if (!file || !abstract || !keywordsStr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse keywords
    const keywords = keywordsStr.split(",").map((k) => k.trim())

    // In production:
    // 1. Upload file to cloud storage (Cloudinary, Firebase Storage, etc.)
    // 2. Save metadata to MongoDB
    // 3. Return saved document

    const newPaper = {
      id: Date.now().toString(),
      fileName: file.name,
      abstract: abstract,
      keywords: keywords,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
    }

    // Store in memory for demo
    papersDatabase.push(newPaper)

    return NextResponse.json(newPaper)
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save paper" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paperId = searchParams.get("id")

    if (!paperId) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 })
    }

    // In production: delete from MongoDB
    papersDatabase = papersDatabase.filter((p) => p.id !== paperId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete paper" }, { status: 500 })
  }
}
