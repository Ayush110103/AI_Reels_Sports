import { NextResponse } from 'next/server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client, isAwsConfigured, getS3Url } from '../../../lib/aws';

export async function GET() {
  try {
    // For development, return mock data if AWS credentials aren't set
    if (!isAwsConfigured()) {
      return NextResponse.json(getMockVideos());
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'videos/',
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('No videos found in S3 bucket, returning mock videos');
      return NextResponse.json(getMockVideos());
    }

    // Filter for video files and create video objects
    const videoPromises = response.Contents
      .filter(item => item.Key.endsWith('.mp4'))
      .map(async (item) => {
        const key = item.Key;
        const id = key.split('/').pop().replace('.mp4', '');
        const title = id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        // Get URLs for the video
        const url = await getS3Url(key);
        
        return {
          id,
          title,
          description: `Watch this amazing moment from ${title}'s career!`,
          url,
          createdAt: item.LastModified,
          likes: Math.floor(Math.random() * 1000) + 100, // Random likes for demo
        };
      });

    const videos = await Promise.all(videoPromises);
    
    // Log the first video URL for debugging
    if (videos.length > 0) {
      console.log('First video URL:', videos[0].url);
    }
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    console.log('Returning mock videos due to error');
    return NextResponse.json(getMockVideos());
  }
}

// Mock data for development with publicly accessible videos
function getMockVideos() {
  return [
    {
      id: 'big-buck-bunny',
      title: 'Big Buck Bunny',
      description: 'A sample video for testing playback',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      createdAt: new Date().toISOString(),
      likes: 1245,
    },
    {
      id: 'elephants-dream',
      title: 'Elephants Dream',
      description: 'Another sample video for testing playback',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      createdAt: new Date().toISOString(),
      likes: 982,
    },
    {
      id: 'tears-of-steel',
      title: 'Tears of Steel',
      description: 'A third sample video for testing playback',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      createdAt: new Date().toISOString(),
      likes: 1532,
    }
  ];
}

