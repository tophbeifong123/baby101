import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  bucket: process.env.S3_BUCKET || 'club-assets',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
  uploadExpiresSeconds: parseInt(
    process.env.S3_UPLOAD_EXPIRES_SECONDS || '300',
    10,
  ),
  readExpiresSeconds: parseInt(
    process.env.S3_READ_EXPIRES_SECONDS || '300',
    10,
  ),
  maxUploadBytes: parseInt(process.env.S3_MAX_UPLOAD_BYTES || '5242880', 10),
}));
