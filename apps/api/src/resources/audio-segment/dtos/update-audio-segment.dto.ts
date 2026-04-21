import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAudioSegmentDTO {
  @ApiProperty()
  @IsString()
  text!: string;
}
