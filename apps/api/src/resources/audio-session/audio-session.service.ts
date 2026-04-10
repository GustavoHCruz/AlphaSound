import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAudioSessionDTO } from './dtos/create-audio-session.dto';

@Injectable()
export class AudioSessionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAudioSessionDTO) {
    return this.prisma.audioSession.create({
      data,
    });
  }

  async processAudio(sessionId: string) {}
}
