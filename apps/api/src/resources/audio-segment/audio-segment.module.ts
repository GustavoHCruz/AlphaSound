import { Module } from '@nestjs/common';
import { AudioSegmentController } from './audio-segment.controller';
import { AudioSegmentService } from './audio-segment.service';

@Module({
  controllers: [AudioSegmentController],
  providers: [AudioSegmentService],
  exports: [AudioSegmentService],
})
export class AudioSegmentModule {}
