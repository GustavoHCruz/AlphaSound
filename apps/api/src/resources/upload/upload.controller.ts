import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AudioSessionService } from '@resources/audio-session/audio-session.service';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';

const uploadDir = join(process.cwd(), 'uploads');

@Controller('upload')
export class UploadController {
  constructor(private audioSessionService: AudioSessionService) {}

  @Post('audio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }

          callback(null, uploadDir);
        },
        filename: (_req, file, callback) => {
          const extension = extname(file.originalname || '').toLowerCase() || '.wav';
          callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
        },
      }),
    }),
  )
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
    if (!file?.path) {
      throw new BadRequestException('File upload failed');
    }

    const session = await this.audioSessionService.create({
      audioPath: file.path,
      userId: user.userId,
    });

    return this.audioSessionService.processAudio(session.id);
  }
}
