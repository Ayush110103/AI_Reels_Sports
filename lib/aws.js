import { S3Client } from '@aws-sdk/client-s3';
import { PollyClient } from '@aws-sdk/client-polly';

// Check if AWS is properly configured
export function isAwsConfigured() {
  return (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  );
}

// Create S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: isAwsConfigured() ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Create Polly client
export const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: isAwsConfigured() ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Generate a direct S3 URL for accessing objects
export function getDirectS3Url(key) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

// Get S3 URL (direct URL for now)
export async function getS3Url(key) {
  if (!isAwsConfigured()) {
    return `/mock-data/${key}`; // For development without AWS
  }
  
  // Return a direct S3 URL
  return getDirectS3Url(key);
}



