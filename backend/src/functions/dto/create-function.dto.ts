import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFunctionDto {
  @ApiProperty({ example: 'generate_image' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Generate AI images', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
