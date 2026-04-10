import { Module } from '@nestjs/common';
import { AudioSessionService } from './audio-session.service';

@Module({
  providers: [AudioSessionService],
  exports: [AudioSessionService],
})
export class AudioSessionModule {}
