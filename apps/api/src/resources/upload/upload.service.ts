import { Injectable } from '@nestjs/common';
import { AudioSessionService } from '@resources/audio-session/audio-session.service';
@Injectable()
export class UploadService {
  constructor(private audioSessionService: AudioSessionService) {}

  async uploadAndTranscribe(
    userId: string,
    audioPath: string,
    audioMinimalSize?: number,
  ) {
    const now = new Date();
    const name = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

    const session = await this.audioSessionService.create({
      audioPath,
      userId,
      name,
    });

    this.audioSessionService.processAudio(
      session.id,
      audioPath,
      audioMinimalSize,
    );

    return session;
  }
}
