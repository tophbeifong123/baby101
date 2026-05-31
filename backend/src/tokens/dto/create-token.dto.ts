import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ example: 'uuid-of-function' })
  @IsNotEmpty()
  @IsUUID()
  functionId: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  maxLimit: number;
}
