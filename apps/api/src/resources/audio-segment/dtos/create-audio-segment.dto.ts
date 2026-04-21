import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAudioSegmentDTO {
  @IsNumber()
  start!: number;

  @IsNumber()
  end!: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  transcription!: string;

  @IsString()
  sessionId!: string;

  @IsString()
  @IsOptional()
  audioBase64?: string;
}
