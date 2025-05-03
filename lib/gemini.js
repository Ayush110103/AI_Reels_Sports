import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a script about a sports celebrity using Gemini
 * @param {string} celebrityName - The name of the sports celebrity
 * @returns {Promise<string>} - The generated script
 */
export async function generateScript(celebrityName) {
  try {
    console.log(`Initializing Gemini with API key: ${process.env.GEMINI_API_KEY ? 'Available' : 'Missing'}`);
    
    // Try different model names that might be available
    const modelNames = ["gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    let error = null;
    
    // Try each model name until one works
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Create the prompt
        const prompt = `Create a 30-second script about ${celebrityName}, the sports celebrity. 
        Include key career highlights, achievements, and interesting facts. 
        Format it as a narration script that's about 80-100 words long.
        The tone should be engaging and informative, suitable for a short video.`;
        
        console.log(`Sending prompt to Gemini model ${modelName}: ${prompt}`);
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`Received response from Gemini: ${text.substring(0, 50)}...`);
        
        return text;
      } catch (e) {
        console.error(`Error with model ${modelName}:`, e);
        error = e;
        // Continue to the next model
      }
    }
    
    // If we get here, all models failed
    throw error || new Error("All Gemini models failed");
    
  } catch (error) {
    console.error('Error generating script with Gemini:', error);
    throw new Error(`Gemini script generation failed: ${error.message}`);
  }
}


