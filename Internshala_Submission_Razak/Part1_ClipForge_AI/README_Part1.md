# ClipForge AI - Lecture to Viral Clips Pipeline

## Overview
AI pipeline that converts 45-60 minute Zoom lectures into viral social media clips.

## Features
- **AI Clip Detection**: Automatically finds top 3-5 moments based on:
  - Hook score (first 15 seconds energy)
  - Audio clarity score
  - Keyword density (engagement prediction)

- **Dual Export Format**:
  - Vertical 9:16 for Instagram Reels / YouTube Shorts
  - Horizontal 16:9 for YouTube main channel

- **Auto Metadata Generation**:
  - 5 click-worthy titles per clip
  - 150-200 word YouTube description
  - Thumbnail prompt for DALL-E/Midjourney

## How It Works (Step by Step)

1. **Upload**: Drag and drop Zoom lecture video (MP4, MOV, AVI)
2. **Transcribe**: AI (Whisper) converts speech to text
3. **Analyze**: Engagement scoring algorithm finds best moments
4. **Clip**: FFmpeg cuts videos in both aspect ratios
5. **Generate**: GPT-4 creates titles, description, thumbnail prompt
6. **Download**: Get all clips + metadata ready to post

## Sample Output

| Clip | Timestamp | Hook Score | 16:9 | 9:16 |
|------|-----------|------------|------|------|
| Clip 1 | 00:15 - 00:52 | 89% | ✅ | ✅ |
| Clip 2 | 12:30 - 13:15 | 71% | ✅ | ✅ |
| Clip 3 | 28:45 - 29:30 | 81% | ✅ | ✅ |

## Sample Titles Generated (Clip 1)

1. "The 10-second rule every student needs to know"
2. "Why students fail at this (and how to fix it)"
3. "Your professor won't tell you this shortcut"
4. "Watch this before your next exam"
5. "The #1 mistake in problem solving"

## Tech Stack

| Component | Technology |
|-----------|------------|
| Transcription | OpenAI Whisper |
| Engagement Scoring | Custom algorithm (Sentence Transformers) |
| Video Clipping | FFmpeg |
| Metadata Generation | GPT-4 / Claude |
| UI | HTML/CSS/JavaScript |

## Screenshots
Attached in the Screenshots folder.

## Submission By
Shivang Aggarwal
Saraswati Vidyamandir, Ambala Cantt
Date: 04 May 2026