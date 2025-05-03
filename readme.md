# SportsCelebrity Reels

A Next.js web application that leverages AI to create short, engaging history reels of sports celebrities. The system generates, stores, and displays AI-created videos in a seamless, reel-style format for sports fans.


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [AI Integration](#ai-integration)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SportsCelebrity Reels is a modern web application that combines the power of AI with a TikTok-style user interface to deliver engaging, short-form content about sports celebrities. The application automatically generates video scripts, converts them to speech, combines them with relevant images, and presents them in an intuitive, vertical-scrolling reel format.

## ✨ Features

- **AI-Generated Content**: Automatically creates engaging scripts about sports celebrities
- **Text-to-Speech Conversion**: Transforms written content into natural-sounding narration
- **TikTok-Style Reel Interface**: Vertical scrolling with smooth transitions between videos
- **Responsive Design**: Optimized for both mobile and desktop viewing experiences
- **Lazy Loading**: Videos load only when needed for optimal performance
- **Like/Share Functionality**: Social engagement features for each reel
- **AWS S3 Integration**: Secure and scalable video storage solution
- **DALL-E Image Generation**: Creates custom images for each sports celebrity

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, CSS Modules
- **Backend**: Next.js API Routes
- **AI Services**:
  - OpenAI GPT-4 for script generation
  - OpenAI DALL-E 3 for image generation
  - Amazon Polly for text-to-speech conversion
  - Google Gemini (alternative for script generation)
- **Video Processing**: FFmpeg for video assembly
- **Storage**: AWS S3 for video and asset storage
- **Deployment**: Vercel

## 🏗️ Architecture

The application follows a modern architecture pattern:

1. **Content Generation Layer**:
   - AI script generation using OpenAI/Gemini
   - Image generation using DALL-E 3
   - Text-to-speech conversion with Amazon Polly
   - Video assembly with FFmpeg
2. **Storage Layer**:
   - AWS S3 for video storage
   - Local caching for performance
3. **API Layer**:
   - Next.js API routes for serving video data
   - Generation endpoints for creating new content
4. **Presentation Layer**:
   - TikTok-style reel interface
   - Responsive design for all devices
   - Client-side caching for performance

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sportscelebrity-reels.git
cd sportscelebrity-reels

# Install dependencies
npm install

# Install FFmpeg (required for video generation)
# On macOS:
brew install ffmpeg

# On Ubuntu/Debian:
sudo apt update
sudo apt install ffmpeg

# On Windows:
# Download from https://ffmpeg.org/download.html and add to PATH

# Run the development server
npm run dev
```

## 🔑 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Gemini API (Alternative to OpenAI)
GEMINI_API_KEY=your_gemini_api_key_here

# AWS Credentials
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=your_aws_region_here
AWS_S3_BUCKET_NAME=your_s3_bucket_name_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 📱 Usage

1. **Browse Reels**: Scroll vertically through the feed to discover sports celebrity reels
2. **Interact**: Like or share reels that interest you
3. **Generate**: Create new reels by entering a sports celebrity name
4. **Enjoy**: Videos play automatically with sound as you scroll

## 📚 API Documentation

### Video Endpoints

#### GET `/api/videos`

Returns a list of all available videos with metadata.

**Response:**

```json
[
  {
    "id":"lebron-james-career",
    "title":"LeBron James Career Highlights",
    "description":"A look at the legendary career of LeBron James",
    "url":"https://your-s3-bucket.s3.region.amazonaws.com/videos/lebron-james-career.mp4",
    "createdAt":"2023-06-15T10:30:00Z",
    "likes":1245
  },
  ...
]
```

#### GET `/api/videos/:id`

Returns detailed information about a specific video.

**Response:**

```json
{
  "id":"lebron-james-career",
  "title":"LeBron James Career Highlights",
  "description":"A look at the legendary career of LeBron James",
  "url":"https://your-s3-bucket.s3.region.amazonaws.com/videos/lebron-james-career.mp4",
  "createdAt":"2023-06-15T10:30:00Z",
  "likes":1245,
  "tags":["basketball","nba","lebron","lakers"],
  "duration":45
}
```

### Generation Endpoints

#### POST `/api/generate`

Generates a new video reel for a specified sports celebrity.

**Request:**

```json
{
  "celebrityName":"Michael Jordan"
}
```

**Response:**

```json
{
  "success": true,
  "videoUrl": "https://your-s3-bucket.s3.region.amazonaws.com/videos/michael-jordan.mp4",
  "script": "Michael Jordan, widely regarded as the greatest basketball player of all time...",
  "id": "michael-jordan"
}
```

## 🤖 AI Integration

### Script Generation

The application uses either OpenAI's GPT-4 or Google's Gemini to generate engaging scripts about sports celebrities. The prompts are carefully crafted to produce content that is:

- Factually accurate
- Engaging and concise
- Structured for short-form video

### Image Generation

DALL-E 3 is used to generate custom images for each sports celebrity based on carefully crafted prompts that highlight:

- Action shots during games
- Celebration moments
- Close-up portraits
- Trophy and achievement images
- Historic moments from their career

### Text-to-Speech

Amazon Polly converts the generated scripts into natural-sounding speech using the Neural engine for the most human-like voice quality. If Polly is unavailable, the system falls back to OpenAI's TTS service.

### Video Assembly

The final videos are assembled using FFmpeg by combining:

- The generated audio narration
- DALL-E generated images of the sports celebrity
- Smooth transitions between images
- Proper timing to match the narration

## 🌐 Deployment

The application is deployed on Vercel for optimal Next.js performance.

**Live Demo**: [https://sportscelebrity-reels.vercel.app](https://sportscelebrity-reels.vercel.app)

## 🔮 Future Enhancements

- **User Accounts**: Allow users to save favorite reels and receive personalized recommendations
- **Advanced Video Generation**: Implement more sophisticated video generation with animations
- **Content Moderation**: Add AI-powered content moderation for user-generated content
- **Analytics Dashboard**: Provide insights into video performance and user engagement
- **Multi-language Support**: Generate reels in multiple languages
