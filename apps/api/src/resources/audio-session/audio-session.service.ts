import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AudioSessionStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { AudioSegmentService } from '@resources/audio-segment/audio-segment.service';
import { readFileSync } from 'fs';
import * as fs from 'fs/promises';
import { firstValueFrom } from 'rxjs';
import { CreateAudioSessionDTO } from './dtos/create-audio-session.dto';

@Injectable()
export class AudioSessionService {
  private readonly logger = new Logger(AudioSessionService.name);

  constructor(
    private audioSegmentService: AudioSegmentService,
    private configService: ConfigService,
    private http: HttpService,
    private prisma: PrismaService,
  ) {}

  async create(data: CreateAudioSessionDTO) {
    return this.prisma.audioSession.create({
      data,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.audioSession.findMany({
      select: {
        id: true,
        createdAt: true,
        status: true,
        name: true,
      },
      where: { userId },
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

  async updateName(sessionId: string, userId: string, name?: string) {
    const session = await this.prisma.audioSession.findFirst({
      where: {
        id: sessionId,
      },
    });

    if (session?.userId !== userId) {
      throw new UnauthorizedException('Not authorized');
    }

    return await this.prisma.audioSession.update({
      where: {
        id: sessionId,
      },
      data: {
        name,
      },
    });
  }

  async deleteSession(sessionId: string, userId: string) {
    const session = await this.prisma.audioSession.findFirst({
      where: {
        id: sessionId,
      },
    });

    if (session?.userId !== userId) {
      throw new UnauthorizedException('Not authorized');
    }

    await fs.unlink(session.audioPath);

    return await this.prisma.audioSession.delete({
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
              audioBase64: segment.audio_base64,
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

  async processAudio(
    sessionId: string,
    audioPath: string,
    audioMinimalSize?: number,
  ) {
    const baseUrl = this.configService.get<string>('TRANSCRIBER_API_URL');

    const fileBuffer = readFileSync(audioPath);
    const audioBase64 = fileBuffer.toString('base64');

    await this.prisma.audioSession.update({
      where: {
        id: sessionId,
      },
      data: {
        audioBase64,
      },
    });

    const response = await firstValueFrom(
      this.http.post(
        `${baseUrl}/transcribe`,
        {
          audio_base64: audioBase64,
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
    const session = (await this.prisma.audioSession.findFirst({
      where: {
        id: sessionId,
      },
      include: {
        segments: true,
      },
    })) as (import('@prisma/client').AudioSession & { segments: any[] }) | null;

    if (session?.userId !== userId) {
      throw new UnauthorizedException('Not authorized');
    }

    return session;
  }
}
