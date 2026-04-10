import { Injectable } from '@nestjs/common';
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
        transcription: data.transcription,
        sessionId: data.sessionId,
      },
    });
  }
}
