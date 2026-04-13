import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AudioSessionStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { AudioSegmentService } from '@resources/audio-segment/audio-segment.service';
import { firstValueFrom } from 'rxjs';
import { CreateAudioSessionDTO } from './dtos/create-audio-session.dto';

@Injectable()
export class AudioSessionService {
  private readonly logger = new Logger(AudioSessionService.name);

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

  async updateStatus(sessionId: string, status: AudioSessionStatus) {
    return this.prisma.audioSession.update({
      data: {
        status,
      },
      where: {
        id: sessionId,
      },
    });
  }

  async handleStream(stream: NodeJS.ReadableStream, sessionId: string) {
    return new Promise((resolve, reject) => {
      let buffer = '';

      stream.on('data', async (chunk) => {
        buffer += chunk.toString();

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const segment = JSON.parse(line);

            await this.audioSegmentService.create({
              start: segment.start,
              end: segment.end,
              text: '',
              transcription: segment.transcription,
              sessionId,
            });
          } catch (err) {
            reject(err);
          }
        }
      });

      stream.on('end', () => {
        this.updateStatus(sessionId, 'COMPLETED');
        resolve({ status: 'completed' });
      });

      stream.on('error', (err) => {
        this.updateStatus(sessionId, 'FAILED');

        this.logger.error(
          `Stream error on session ${sessionId}`,
          err.stack || err.message,
        );

        reject(err);
      });
    });
  }

  async processAudio(sessionId: string, audioMinimalSize?: number) {
    const session = await this.prisma.audioSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return null;

    const baseUrl = process.env.TRANSCRIBER_API_URL;
    if (!baseUrl) throw new Error('TRANSCRIBER_API_URL not set');

    const response = await firstValueFrom(
      this.http.post(
        `${baseUrl}/transcribe`,
        {
          audio_path: session.audioPath,
          audio_minimal_size: audioMinimalSize || 30,
        },
        {
          responseType: 'stream',
        },
      ),
    );

    return await this.handleStream(response.data, sessionId);
  }

  async findOneSessionWithSegments(userId: string, sessionId: string) {
    const session = await this.prisma.audioSession.findFirst({
      where: {
        id: sessionId,
      },
      include: {
        segments: true,
      },
    });

    if (session?.userId !== userId) {
      throw new UnauthorizedException('Not authorized');
    }

    return session;
  }
}
