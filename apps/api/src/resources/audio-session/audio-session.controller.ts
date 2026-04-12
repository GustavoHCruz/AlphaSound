import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { AudioSessionService } from './audio-session.service';

@Controller('audio-sessions')
export class AudioSessionController {
  constructor(private service: AudioSessionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMySessions(@GetUser() user: AuthUser) {
    return this.service.findByUser(user.userId);
  }
}
