import { Storage } from '@google-cloud/storage';
import path from 'path';
import { randomUUID } from 'crypto';

const projectId = process.env.GCP_PROJECT;
const bucketName = process.env.GCS_BUCKET as string;

console.log('Using env:', process.env.TEST)


const storage = new Storage({ projectId });
const bucket = storage.bucket(bucketName);

export async function uploadBufferToGcs(
  buffer: Buffer,
  originalName: string,
  contentType: string
): Promise<string> {
  const ext = path.extname(originalName) || '.bin';
  const objectName = `uploads/${randomUUID()}${ext}`;
  const file = bucket.file(objectName);
  await file.save(buffer, { contentType, resumable: false, public: true });
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
  return publicUrl;
}

