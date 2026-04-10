import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AudioSessionService } from '@resources/audio-session/audio-session.service';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';

@Controller('upload')
export class UploadController {
  constructor(private audioSessionService: AudioSessionService) {}

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: AuthUser,
  ) {
    const session = await this.audioSessionService.create({
      audioPath: file.path,
      userId: user.userId,
    });

    return this.audioSessionService.processAudio(session.id);
  }
}
