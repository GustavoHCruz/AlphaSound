import { IsOptional, IsString } from 'class-validator';

export class CreateAudioSessionDTO {
  @IsString()
  audioPath!: string;

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  audioBase64?: string;
}
