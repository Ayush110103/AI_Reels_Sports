import OpenAI from 'openai';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import util from 'util';
import fetch from 'node-fetch';

const execPromise = util.promisify(exec);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to format time for subtitles (HH:MM:SS,MS)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

// Function to download an image from a URL
async function downloadImage(url, outputPath) {
  try {
    console.log(`Downloading image from ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`Image saved to ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

// Function to fetch images related to the celebrity
async function fetchImages(celebrityName, count = 5) {
  try {
    console.log(`Generating images for ${celebrityName} using DALL-E...`);
    
    // Generate prompts for the images
    const prompts = [
      `Professional high-quality portrait of ${celebrityName}, the sports celebrity, in action during a game or match.`,
      `${celebrityName} celebrating a major victory or achievement in their sports career.`,
      `Close-up of ${celebrityName} showing determination and focus during competition.`,
      `${celebrityName} with trophies or medals from their career achievements.`,
      `Historical or iconic moment from ${celebrityName}'s sports career.`
    ];
    
    // Generate images in parallel
    const imagePromises = prompts.slice(0, count).map(async (prompt, index) => {
      console.log(`Generating image ${index+1}/${count} with prompt: "${prompt.substring(0, 50)}..."`);
      
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
        });
        
        console.log(`Image ${index+1} generated successfully`);
        return response.data[0].url;
      } catch (error) {
        console.error(`Error generating image ${index+1}:`, error);
        // Return a fallback image URL if DALL-E fails
        return getDefaultImageForSport(celebrityName, index);
      }
    });
    
    const urls = await Promise.all(imagePromises);
    console.log(`Generated ${urls.length} images for ${celebrityName}`);
    return urls;
  } catch (error) {
    console.error('Error generating images:', error);
    // Return default images if the whole process fails
    return getDefaultImagesForSport(celebrityName, count);
  }
}

// Function to get a default image based on sport type
async function getDefaultImageForSport(celebrityName, index) {
  try {
    // Determine the sport type
    const sportType = await determineSportType(celebrityName);
    
    // Default images by sport
    const defaultImages = {
      swimming: [
        'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
        'https://images.pexels.com/photos/73760/swimming-swimmer-female-race-73760.jpeg',
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg'
      ],
      basketball: [
        'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg',
        'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg'
      ],
      football: [
        'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'
      ],
      tennis: [
        'https://images.pexels.com/photos/8224057/pexels-photo-8224057.jpeg',
        'https://images.pexels.com/photos/5739101/pexels-photo-5739101.jpeg'
      ],
      general: [
        'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg',
        'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg'
      ]
    };
    
    // Select the appropriate category
    let category = 'general';
    if (sportType.includes('swim')) category = 'swimming';
    else if (sportType.includes('basket')) category = 'basketball';
    else if (sportType.includes('foot') || sportType.includes('soccer')) category = 'football';
    else if (sportType.includes('tennis')) category = 'tennis';
    
    // Get an image from the category
    const images = defaultImages[category];
    const imageIndex = index % images.length;
    
    console.log(`Using default ${category} image for ${celebrityName}`);
    return images[imageIndex];
  } catch (error) {
    console.error('Error getting default image:', error);
    return 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg'; // Fallback image
  }
}

// Function to get multiple default images
async function getDefaultImagesForSport(celebrityName, count) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(await getDefaultImageForSport(celebrityName, i));
  }
  return images;
}

// Function to determine the sport type using OpenAI
async function determineSportType(celebrityName) {
  try {
    console.log(`Determining sport type for ${celebrityName} using AI...`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sports knowledge assistant. Respond with only the name of the sport."
        },
        {
          role: "user",
          content: `What sport is ${celebrityName} primarily known for? Answer with just the sport name.`
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const sportType = response.choices[0].message.content.trim().toLowerCase();
    console.log(`AI determined that ${celebrityName} is associated with: ${sportType}`);
    return sportType;
    
  } catch (error) {
    console.error('Error determining sport type:', error);
    return 'general sports';
  }
}

// Function to create subtitles from script
function createSubtitlesFile(script, outputPath) {
  // Simple subtitle generation - in a real app, you'd want to time these properly
  const lines = script.split(/[.!?]/).filter(line => line.trim().length > 0);
  let subtitles = '';
  let startTime = 0;
  
  lines.forEach((line, index) => {
    // Estimate 0.3 seconds per word
    const duration = line.split(' ').length * 0.3;
    const endTime = startTime + duration;
    
    // Format: [start time] --> [end time]
    subtitles += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    subtitles += `${line.trim()}.\n\n`;
    
    startTime = endTime + 0.1; // Small gap between subtitles
  });
  
  fs.writeFileSync(outputPath, subtitles);
  return outputPath;
}

// Main function to generate video
export async function generateVideo(celebrityName, script, audioBuffer) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'video-gen-'));
  const intermediateFiles = [];
  
  try {
    console.log(`Creating temporary directory: ${tempDir}`);
    
    // Save audio file
    const audioPath = path.join(tempDir, 'narration.mp3');
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
    console.log(`Audio saved to ${audioPath}`);
    
    // Fetch images
    console.log(`Fetching images for ${celebrityName}...`);
    const imageUrls = await fetchImages(celebrityName);
    console.log(`Got ${imageUrls.length} image URLs`);
    
    // Download images
    const imagePaths = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        console.log(`Downloading image ${i+1}/${imageUrls.length}`);
        const imagePath = path.join(tempDir, `image_${i}.jpg`);
        await downloadImage(imageUrls[i], imagePath);
        imagePaths.push(imagePath);
        console.log(`Image ${i+1} downloaded successfully`);
      } catch (downloadError) {
        console.error(`Failed to download image ${i+1}:`, downloadError);
        // Create a blank image as fallback
        try {
          console.log('Creating blank image as fallback');
          // Create a simple colored rectangle as a fallback image
          await execPromise(
            `ffmpeg -f lavfi -i color=c=blue:s=1280x720 -frames:v 1 "${path.join(tempDir, `blank_${i}.jpg`)}"`
          );
          imagePaths.push(path.join(tempDir, `blank_${i}.jpg`));
        } catch (blankError) {
          console.error('Failed to create blank image:', blankError);
        }
      }
    }
    
    if (imagePaths.length === 0) {
      throw new Error('Failed to download any images for the video');
    }
    
    // Generate video using FFmpeg
    const outputPath = path.join(tempDir, 'output.mp4');
    const finalOutputPath = path.join(tempDir, 'final_output.mp4');
    
    // Get audio duration
    const { stdout: audioDuration } = await execPromise(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`
    );
    
    const totalDuration = parseFloat(audioDuration.trim());
    const segmentDuration = totalDuration / imagePaths.length;
    
    // Create a segment for each image
    for (let i = 0; i < imagePaths.length; i++) {
      const segmentPath = path.join(tempDir, `segment_${i}.mp4`);
      intermediateFiles.push(segmentPath);
      
      // Calculate start and end times for this segment
      const startTime = i * segmentDuration;
      const duration = segmentDuration;
      
      // Create segment with image and portion of audio - use double quotes for Windows paths
      await execPromise(
        `ffmpeg -loop 1 -i "${imagePaths[i]}" -ss ${startTime} -t ${duration} -i "${audioPath}" ` +
        `-c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${segmentPath}"`
      );
    }
    
    // Create a file list for concatenation
    const fileListPath = path.join(tempDir, 'filelist.txt');
    // Use forward slashes in the file list for FFmpeg
    const fileListContent = intermediateFiles.map(file => 
      `file '${file.replace(/\\/g, '/')}'`
    ).join('\n');
    fs.writeFileSync(fileListPath, fileListContent);
    
    // Concatenate all segments
    await execPromise(
      `ffmpeg -f concat -safe 0 -i "${fileListPath}" -c copy "${outputPath}"`
    );
    
    // Skip adding text captions - just use the output file as the final output
    fs.copyFileSync(outputPath, finalOutputPath);
    
    // Read the generated video
    const videoBuffer = fs.readFileSync(finalOutputPath);
    
    return videoBuffer;
  } catch (error) {
    console.error('Error in video generation:', error);
    throw error;
  } finally {
    // Clean up temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
  }
}




















