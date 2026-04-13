import { Module } from '@nestjs/common';
import { AudioSessionModule } from '@resources/audio-session/audio-session.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [AudioSessionModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
