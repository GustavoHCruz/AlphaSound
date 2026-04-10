import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AudioSegmentModule } from '@resources/audio-segment/audio-segment.module';
import { AudioSessionService } from './audio-session.service';

@Module({
  imports: [AudioSegmentModule, HttpModule],
  providers: [AudioSessionService],
  exports: [AudioSessionService],
})
export class AudioSessionModule {}
