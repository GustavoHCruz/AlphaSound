import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UploadAudioDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  audioMinimalSize?: number = 30;
}
