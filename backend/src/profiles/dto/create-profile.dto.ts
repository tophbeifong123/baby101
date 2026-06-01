import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Mint' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  nickname: string;

  @ApiProperty({ example: 'profiles/2026-06-02/uuid.png' })
  @IsString()
  @IsNotEmpty()
  avatarKey: string;
}
