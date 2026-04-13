import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { AudioSegmentService } from './audio-segment.service';
import { UpdateAudioSegmentDTO } from './dtos/update-audio-segment.dto';

@Controller('audio-segment')
export class AudioSegmentController {
  constructor(private audioSegmentService: AudioSegmentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateText(
    @GetUser() user: AuthUser,
    @Param('id') audioSegmentId: string,
    @Body() data: UpdateAudioSegmentDTO,
  ) {
    return this.audioSegmentService.updateText(
      audioSegmentId,
      user.userId,
      data.text,
    );
  }
}
