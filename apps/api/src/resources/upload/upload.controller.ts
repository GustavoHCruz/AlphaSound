import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { UploadAudioDTO } from './dtos/upload-audio.dto';
import { UploadService } from './upload.service';

const uploadDir = join(process.cwd(), 'uploads');

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

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
          const extension =
            extname(file.originalname || '').toLowerCase() || '.wav';
          callback(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
          );
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
    @Body() data: UploadAudioDTO,
  ) {
    if (!file?.path) {
      throw new BadRequestException('File upload failed');
    }

    return this.uploadService.uploadAndTranscribe(
      user.userId,
      file.path,
      data.audioMinimalSize,
    );
  }
}
