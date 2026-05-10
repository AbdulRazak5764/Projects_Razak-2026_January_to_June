export const metadata = {
  title: "Medicine Authenticity Detection System",
  description: "Real-time AI-powered tablet authenticity verification using computer vision and deep learning",
}

export default function Home() {
  return <HomePageClient />
}

// Import the client component after defining the server component.
// This ensures that the server component is defined before it's used.
import HomePageClient from "./HomePageClient"
