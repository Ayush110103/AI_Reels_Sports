import OpenAI from 'openai';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { s3Client, pollyClient } from '../../../lib/aws';
import { generateVideo } from '../../../lib/videoGenerator';
import { generateScript } from '../../../lib/gemini';

// Initialize OpenAI client conditionally to avoid build errors
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Fallback function to generate audio using OpenAI TTS if Polly fails
async function generateAudioWithOpenAI(text) {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }
  
  console.log('Falling back to OpenAI TTS...');
  const mp3Response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  
  const buffer = Buffer.from(await mp3Response.arrayBuffer());
  return buffer;
}

export async function POST(request) {
  // Check for required environment variables
  const missingVars = [];
  if (!process.env.OPENAI_API_KEY) missingVars.push('OPENAI_API_KEY');
  if (!process.env.AWS_ACCESS_KEY_ID) missingVars.push('AWS_ACCESS_KEY_ID');
  if (!process.env.AWS_SECRET_ACCESS_KEY) missingVars.push('AWS_SECRET_ACCESS_KEY');
  if (!process.env.AWS_REGION) missingVars.push('AWS_REGION');
  if (!process.env.AWS_S3_BUCKET_NAME) missingVars.push('AWS_S3_BUCKET_NAME');
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return Response.json({ 
      error: 'Server configuration error', 
      message: 'The server is missing required configuration. Please contact the administrator.',
      details: `Missing: ${missingVars.join(', ')}`
    }, { status: 500 });
  }

  try {
    // Log environment variables (without exposing full keys)
    console.log('Environment check:');
    console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing');
    console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing');
    console.log('- AWS_REGION:', process.env.AWS_REGION || '✗ Missing');
    console.log('- AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || '✗ Missing');
    
    // Parse request body
    let celebrityName;
    try {
      const body = await request.json();
      celebrityName = body.celebrityName;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return Response.json({ 
        error: 'Invalid request body', 
        details: parseError.message 
      }, { status: 400 });
    }
    
    if (!celebrityName) {
      return Response.json({ error: 'Celebrity name is required' }, { status: 400 });
    }
    
    console.log(`Starting generation process for ${celebrityName}...`);
    
    // 1. Generate script using Gemini
    let script;
    try {
      console.log(`Generating script for ${celebrityName}...`);
      script = await generateScript(celebrityName);
      console.log(`Script generated successfully: ${script.substring(0, 50)}...`);
    } catch (scriptError) {
      console.error('Error generating script:', scriptError);
      return Response.json({ 
        error: 'Failed to generate script', 
        details: scriptError.message 
      }, { status: 500 });
    }
    
    // 2. Generate audio
    let audioBuffer;
    try {
      console.log('Generating audio with Amazon Polly...');
      const pollyCommand = new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        Text: script,
        VoiceId: "Matthew",
        Engine: "neural",
      });
      
      const audioResponse = await pollyClient.send(pollyCommand);
      audioBuffer = await audioResponse.AudioStream.transformToByteArray();
      console.log('Audio generated successfully with Polly');
    } catch (pollyError) {
      console.error('Error with Polly, falling back to OpenAI TTS:', pollyError);
      try {
        audioBuffer = await generateAudioWithOpenAI(script);
        console.log('Audio generated successfully with OpenAI TTS');
      } catch (ttsError) {
        console.error('Error generating audio with OpenAI TTS:', ttsError);
        return Response.json({ 
          error: 'Failed to generate audio', 
          details: ttsError.message 
        }, { status: 500 });
      }
    }
    
    // 3. Generate video
    let videoBuffer;
    try {
      console.log('Starting video generation process...');
      videoBuffer = await generateVideo(celebrityName, script, audioBuffer);
      console.log('Video generated successfully');
    } catch (videoError) {
      console.error('Error generating video:', videoError);
      
      // Return a more user-friendly error
      return Response.json({ 
        error: 'Failed to generate video', 
        details: 'There was an issue with image processing. Please try again later.',
        technicalDetails: videoError.message
      }, { status: 500 });
    }
    
    // 4. Upload to S3
    let videoUrl;
    try {
      console.log('Uploading to S3...');
      const fileName = `${celebrityName.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.mp4`;
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `videos/${fileName}`,
        Body: videoBuffer,
        ContentType: 'video/mp4',
      });
      
      await s3Client.send(uploadCommand);
      console.log('Upload complete');
      
      videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${fileName}`;
    } catch (uploadError) {
      console.error('Error uploading to S3:', uploadError);
      return Response.json({ 
        error: 'Failed to upload video', 
        details: uploadError.message 
      }, { status: 500 });
    }
    
    // 5. Return success response
    const id = celebrityName.toLowerCase().replace(/\s+/g, '-');
    return Response.json({ 
      success: true, 
      videoUrl,
      script,
      id
    });
    
  } catch (error) {
    console.error('Unhandled error in generate API:', error);
    return Response.json({ 
      error: 'Failed to generate video', 
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}















