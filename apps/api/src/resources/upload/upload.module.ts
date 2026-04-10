import { Module } from '@nestjs/common';
import { AudioSessionModule } from '@resources/audio-session/audio-session.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [AudioSessionModule],
  controllers: [UploadController],
})
export class UploadModule {}
