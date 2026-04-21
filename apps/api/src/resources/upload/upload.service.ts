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
    const session = await this.audioSessionService.create({
      audioPath,
      userId,
    });

    this.audioSessionService.processAudio(
      session.id,
      audioPath,
      audioMinimalSize,
    );

    return session;
  }
}
