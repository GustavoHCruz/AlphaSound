import { Module } from '@nestjs/common';
import { AudioSegmentService } from './audio-segment.service';

@Module({
  providers: [AudioSegmentService],
  exports: [AudioSegmentService],
})
export class AudioSegmentModule {}
