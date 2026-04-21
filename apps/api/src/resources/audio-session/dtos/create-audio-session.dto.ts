import { IsOptional, IsString } from 'class-validator';

export class CreateAudioSessionDTO {
  @IsString()
  name!: string;

  @IsString()
  audioPath!: string;

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  audioBase64?: string;
}
