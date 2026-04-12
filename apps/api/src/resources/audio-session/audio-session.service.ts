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

  async findByUser(userId: string) {
    return this.prisma.audioSession.findMany({
      where: { userId },
      include: { segments: true },
      orderBy: { createdAt: 'desc' },
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

    const transcriber_url = process.env.TRANSCRIBER_API_URL;

    if (!transcriber_url) {
      throw new Error('TRANSCRIBER_API_URL is not defined on env');
    }

    const transcriberBaseUrl = /^https?:\/\//i.test(transcriber_url)
      ? transcriber_url
      : `http://${transcriber_url}`;

    const response = await firstValueFrom(
      this.http.post(
        `${transcriberBaseUrl}/transcribe`,
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
