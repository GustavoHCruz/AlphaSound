import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { AudioSessionService } from './audio-session.service';
import { UpdateAudioSessionDTO } from './dtos/update-audio-session.dto';

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateName(
    @GetUser() user: AuthUser,
    @Param('id') sessionId: string,
    @Body() data: UpdateAudioSessionDTO,
  ) {
    return this.audioSessionService.updateName(
      sessionId,
      user.userId,
      data.name,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteSession(@GetUser() user: AuthUser, @Param('id') sessionId: string) {
    return this.audioSessionService.deleteSession(sessionId, user.userId);
  }
}
