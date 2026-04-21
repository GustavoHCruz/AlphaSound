import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAudioSegmentDTO } from './dtos/create-audio-segment.dto';

@Injectable()
export class AudioSegmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAudioSegmentDTO) {
    return this.prisma.audioSegment.create({
      data: {
        start: data.start,
        end: data.end,
        text: data.text || '',
        audioBase64: data.audioBase64,
        transcription: data.transcription,
        sessionId: data.sessionId,
      },
    });
  }

  async updateText(audioSegmentId: string, userId: string, text: string) {
    const audioSegment = await this.prisma.audioSegment.findFirst({
      where: {
        id: audioSegmentId,
      },
      include: {
        session: true,
      },
    });

    if (audioSegment?.session.userId !== userId) {
      throw new UnauthorizedException('Not authorized');
    }

    return this.prisma.audioSegment.update({
      where: {
        id: audioSegmentId,
      },
      data: {
        text,
      },
    });
  }
}
