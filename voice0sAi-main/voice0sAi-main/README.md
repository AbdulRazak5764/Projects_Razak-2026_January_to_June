# VoiceOS AI - Advanced Real-Time Voice-First Intelligent Assistant

A cutting-edge voice-first intelligent assistant platform built for the Murf AI Voice Hackathon 2026. VoiceOS AI enables users to interact entirely through speech with intelligent decision-making, emotion awareness, and real-time responses.

## Features

### Core Capabilities

- **Real-Time Voice Interaction**: Continuous voice input with instant response using Murf Falcon TTS API
- **Intent Detection Engine**: Automatically detects user intent and routes to the correct module
- **Emotion-Aware Responses**: Analyzes emotional context and adjusts tone accordingly
- **Context-Aware Conversation**: Remembers previous queries and supports follow-up questions
- **Voice Productivity System**: Task management, reminders, and daily planning through voice
- **AI Educational Tutor**: Concept explanation, step-by-step learning, and doubt solving

### Technical Highlights

- Voice latency optimized for real-time interaction
- Intelligent routing system for productivity vs. learning modes
- Persistent conversation history and context storage
- Task management with due dates and completion tracking
- Beautiful, responsive UI with wave animations

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Voice Input**: Web Speech API
- **Voice Output**: Murf Falcon TTS API (with browser TTS fallback)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── VoiceOS.tsx           # Main application component
│   ├── WaveAnimation.tsx     # Animated voice wave visualization
│   ├── MessageBubble.tsx     # Chat message display
│   └── TaskList.tsx          # Task management UI
├── services/
│   ├── conversationService.ts # Chat history and context management
│   └── taskService.ts         # Task CRUD operations
├── utils/
│   ├── intentDetection.ts     # Intent classification engine
│   ├── emotionAnalysis.ts     # Emotion detection
│   ├── aiProcessor.ts         # AI response generation
│   ├── murfTTS.ts            # Murf Falcon TTS integration
│   └── speechRecognition.ts  # Speech-to-text wrapper
├── lib/
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # TypeScript definitions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Murf API key (optional - falls back to browser TTS)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_MURF_API_KEY=your_murf_api_key_here
   ```

4. The database schema is automatically applied to your Supabase instance

5. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

## Usage Examples

### Voice Commands

**Productivity:**
- "Add a meeting at 6 PM"
- "Remind me to call John at 5 PM"
- "What are my tasks?"
- "Mark task as complete"

**Learning:**
- "Explain recursion"
- "What is a DBMS?"
- "How does an algorithm work?"
- "I didn't understand, can you simplify?"

**General:**
- "Hello"
- "What can you do?"

## Architecture Flow

```
User Voice Input
    ↓
Speech-to-Text (Web Speech API)
    ↓
Intent Detection Engine
    ↓
Emotion Analysis
    ↓
Context Retrieval (Supabase)
    ↓
AI Response Generation
    ↓
Response Storage (Supabase)
    ↓
Text-to-Speech (Murf Falcon)
    ↓
Voice Output
```

## Database Schema

### Tables

- **conversations**: Stores chat history with intent and emotion metadata
- **tasks**: Manages user tasks and reminders
- **user_context**: Maintains conversation context for continuity
- **learning_sessions**: Tracks educational interactions

All tables have Row Level Security (RLS) enabled for data protection.

## Key Features Breakdown

### Intent Detection
The system recognizes intents including:
- Task creation, listing, and completion
- Learning and explanation requests
- Clarification needs
- General queries

### Emotion Analysis
Detects user emotions:
- Confused
- Curious
- Frustrated
- Happy
- Neutral

Responses are tailored based on emotional state.

### Context Awareness
- Tracks last intent and topic
- Enables follow-up questions
- Maintains conversation flow
- Simplifies explanations when needed

## Browser Compatibility

- Chrome/Edge: Full support (recommended)
- Firefox: Full support
- Safari: Limited Web Speech API support
- Mobile: Variable support depending on browser

## Future Enhancements

- Multilingual support (Hindi + English)
- Voice authentication
- Calendar integration
- Advanced learning modules
- Voice customization
- Offline mode

## Hackathon Submission

**Project**: VoiceOS AI
**Category**: Voice Productivity Assistant & Educational Voice Tutor
**API Used**: Murf Falcon Text-to-Speech API
**Innovation**: Real-time voice-first platform with intelligent decision-making

## License

MIT License - Built for Murf AI Voice Hackathon 2026
