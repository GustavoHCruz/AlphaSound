
import { Injectable } from '@nestjs/common';
import { AudioSessionService } from '@resources/audio-session/audio-session.service';
import { readFileSync } from 'fs';
@Injectable()
export class UploadService {
  constructor(private audioSessionService: AudioSessionService) {}

  // Removido import duplicado e fora de lugar

  async uploadAndTranscribe(
    userId: string,
    audioPath: string,
    audioMinimalSize?: number,
  ) {
    // Lê o arquivo e converte para base64
    const fileBuffer = readFileSync(audioPath);
    const audioBase64 = fileBuffer.toString('base64');

    const session = await this.audioSessionService.create({
      audioPath,
      audioBase64,
      userId,
    });

    this.audioSessionService.processAudio(session.id, audioMinimalSize);

    return session;
  }
}
