import { IsString } from 'class-validator';

export class CreateAudioSessionDTO {
  @IsString()
  audioPath!: string;

  @IsString()
  userId!: string;
}
