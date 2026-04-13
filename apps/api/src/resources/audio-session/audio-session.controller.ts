import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { AudioSessionService } from './audio-session.service';

@Controller('audio-session')
export class AudioSessionController {
  constructor(private audioSessionService: AudioSessionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-sessions')
  findMySessions(@GetUser() user: AuthUser) {
    return this.audioSessionService.findByUser(user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@GetUser() user: AuthUser, @Param('id') sessionId: string) {
    return this.audioSessionService.findOneSessionWithSegments(
      user.userId,
      sessionId,
    );
  }
}
