import { NextResponse } from 'next/server';
import { s3Client, pollyClient, isAwsConfigured } from '../../../lib/aws';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const results = {
    aws: {
      configured: isAwsConfigured(),
      s3BucketName: process.env.AWS_S3_BUCKET_NAME || 'Not configured',
      region: process.env.AWS_REGION || 'Not configured'
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      keyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'Not configured'
    },
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      keyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 7) + '...' : 'Not configured'
    },
    serpapi: {
      configured: !!process.env.SERPAPI_KEY,
      keyPrefix: process.env.SERPAPI_KEY ? process.env.SERPAPI_KEY.substring(0, 7) + '...' : 'Not configured'
    }
  };

  // Test SerpAPI
  if (results.serpapi.configured) {
    try {
      // Use a direct Pexels API test instead of SerpAPI
      results.serpapi.status = 'Skipped';
      results.serpapi.message = 'Using placeholder images instead of SerpAPI';
      
      // Check if we can access placeholder images
      const placeholderUrl = 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg';
      const response = await fetch(placeholderUrl, { method: 'HEAD' });
      
      if (response.ok) {
        results.placeholders = {
          status: 'Working',
          message: 'Placeholder images are accessible'
        };
      } else {
        results.placeholders = {
          status: 'Error',
          error: `Status ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      results.serpapi.status = 'Error';
      results.serpapi.error = error.message;
    }
  }

  return NextResponse.json(results);
}
