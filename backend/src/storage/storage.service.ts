import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';

const CONTENT_TYPE_TO_EXTENSION: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly maxUploadBytes: number;
  private readonly uploadExpiresSeconds: number;
  private readonly readExpiresSeconds: number;

  constructor(private readonly configService: ConfigService) {
    // All S3 credentials stay in the backend. The browser only receives
    // short-lived presigned URLs, never the access key or secret key.
    this.bucket = this.configService.getOrThrow<string>('storage.bucket');
    this.maxUploadBytes =
      this.configService.get<number>('storage.maxUploadBytes') ||
      5 * 1024 * 1024;
    this.uploadExpiresSeconds =
      this.configService.get<number>('storage.uploadExpiresSeconds') || 300;
    this.readExpiresSeconds =
      this.configService.get<number>('storage.readExpiresSeconds') || 300;

    this.s3 = new S3Client({
      endpoint: this.configService.getOrThrow<string>('storage.endpoint'),
      region: this.configService.getOrThrow<string>('storage.region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('storage.accessKey'),
        secretAccessKey:
          this.configService.getOrThrow<string>('storage.secretKey'),
      },
      forcePathStyle: this.configService.get<boolean>('storage.forcePathStyle'),
    });
  }

  async createPresignedUpload(input: CreatePresignedUploadDto) {
    // Validate before signing. Frontend validation is for UX; backend validation
    // is the real security boundary because users can edit browser requests.
    this.validateUploadRequest(input);
    await this.assertBucketExists();

    // The backend creates the object key so filenames cannot collide and users
    // cannot choose confusing keys such as "../../secret.png".
    const extension = CONTENT_TYPE_TO_EXTENSION[input.contentType];
    const today = new Date().toISOString().slice(0, 10);
    const key = `profiles/${today}/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: input.contentType,
    });

    // This URL is the temporary "upload ticket" used by the frontend.
    // It works only for this object key and expires quickly.
    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.uploadExpiresSeconds,
    });

    return {
      bucket: this.bucket,
      key,
      uploadUrl,
      expiresIn: this.uploadExpiresSeconds,
    };
  }

  async createReadUrl(key: string) {
    // The bucket can stay private. The frontend receives a temporary read URL
    // whenever it needs to render the image in a profile card.
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: this.readExpiresSeconds,
    });
  }

  getBucket() {
    return this.bucket;
  }

  private validateUploadRequest(input: CreatePresignedUploadDto) {
    if (!CONTENT_TYPE_TO_EXTENSION[input.contentType]) {
      throw new BadRequestException({
        message: 'Unsupported file type',
        allowedTypes: Object.keys(CONTENT_TYPE_TO_EXTENSION),
      });
    }

    if (input.size > this.maxUploadBytes) {
      throw new BadRequestException({
        message: 'File is too large',
        maxUploadBytes: this.maxUploadBytes,
      });
    }
  }

  private async assertBucketExists() {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      // This error message points students to the exact workshop step they
      // probably missed: creating the bucket in MinIO Console.
      throw new InternalServerErrorException({
        message: `Bucket "${this.bucket}" is not ready. Open http://localhost:9001 and create it first.`,
      });
    }
  }
}
