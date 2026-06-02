import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreatePresignedUploadDto {
  @ApiProperty({ example: 'avatar.png' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ example: 120000 })
  @IsInt()
  @Min(1)
  @Max(20 * 1024 * 1024)
  size: number;
}
