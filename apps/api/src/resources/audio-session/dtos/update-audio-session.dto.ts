import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAudioSessionDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
