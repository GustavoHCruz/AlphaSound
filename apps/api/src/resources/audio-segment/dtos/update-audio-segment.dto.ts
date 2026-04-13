import { IsString } from 'class-validator';

export class UpdateAudioSegmentDTO {
  @IsString()
  text!: string;
}
