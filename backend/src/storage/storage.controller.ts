import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { StorageService } from './storage.service';

@ApiTags('storage-workshop')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presign-upload')
  @ApiOperation({ summary: 'Create a temporary URL for uploading an avatar' })
  @ApiResponse({ status: 201, description: 'Presigned upload URL returned' })
  @ApiResponse({ status: 400, description: 'Invalid file type or file size' })
  createPresignedUpload(@Body() body: CreatePresignedUploadDto) {
    // Workshop flow: frontend calls this endpoint before it uploads a file.
    // The response contains uploadUrl + object key.
    return this.storageService.createPresignedUpload(body);
  }
}
