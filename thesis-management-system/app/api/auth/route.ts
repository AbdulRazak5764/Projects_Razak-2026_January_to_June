import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, fullName } = body

    // Simulate auth - in production use real database
    if (action === "login") {
      // Validate credentials
      if (!email || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
      }

      // Simulate successful login
      return NextResponse.json({
        success: true,
        user: { email, fullName: fullName || email },
      })
    } else if (action === "register") {
      // Validate input
      if (!email || !password || !fullName) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
      }

      // Simulate successful registration
      return NextResponse.json({
        success: true,
        user: { email, fullName },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}
