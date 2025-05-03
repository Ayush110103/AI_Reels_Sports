import { S3Client } from '@aws-sdk/client-s3';
import { PollyClient } from '@aws-sdk/client-polly';

// Check if we have the required AWS credentials
export const isAwsConfigured = () => {
  const configured = !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  );
  
  if (!configured) {
    console.warn('AWS is not properly configured. Missing required environment variables.');
  }
  
  return configured;
};

// Initialize S3 client with error handling
export const s3Client = (() => {
  try {
    if (!isAwsConfigured()) return null;
    
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  } catch (error) {
    console.error('Failed to initialize S3 client:', error);
    return null;
  }
})();

// Initialize Polly client with error handling
export const pollyClient = (() => {
  try {
    if (!isAwsConfigured()) return null;
    
    return new PollyClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  } catch (error) {
    console.error('Failed to initialize Polly client:', error);
    return null;
  }
})();

// Helper function to get S3 URL
export function getS3Url(key) {
  if (!isAwsConfigured() || !process.env.AWS_S3_BUCKET_NAME) {
    console.warn('Cannot generate S3 URL: AWS not configured or bucket name missing');
    return null;
  }
  
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// Get S3 URL (direct URL for now)
export async function getS3Url(key) {
  if (!isAwsConfigured()) {
    return `/mock-data/${key}`; // For development without AWS
  }
  
  // Return a direct S3 URL
  return getDirectS3Url(key);
}





