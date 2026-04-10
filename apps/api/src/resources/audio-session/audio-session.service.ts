import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AudioSegmentService } from '@resources/audio-segment/audio-segment.service';
import { firstValueFrom } from 'rxjs';
import { CreateAudioSessionDTO } from './dtos/create-audio-session.dto';

@Injectable()
export class AudioSessionService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private audioSegmentService: AudioSegmentService,
  ) {}

  async create(data: CreateAudioSessionDTO) {
    return this.prisma.audioSession.create({
      data,
    });
  }

  async handleStream(stream: NodeJS.ReadableStream, sessionId: string) {
    let buffer = '';

    stream.on('data', async (chunk) => {
      buffer += chunk.toString();

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        const segment = JSON.parse(line);

        await this.audioSegmentService.create({
          start: segment.start,
          end: segment.end,
          text: '',
          transcription: segment.transcription,
          sessionId,
        });
      }
    });

    return { status: 'processing' };
  }

  async processAudio(sessionId: string) {
    const session = await this.prisma.audioSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    const response = await firstValueFrom(
      this.http.post(
        'http://python-service/transcribe',
        {
          audio_path: session.audioPath,
          group: true,
        },
        {
          responseType: 'stream',
        },
      ),
    );

    return this.handleStream(response.data, sessionId);
  }
}
