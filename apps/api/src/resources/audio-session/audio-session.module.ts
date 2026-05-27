import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AudioSegmentModule } from '@resources/audio-segment/audio-segment.module';
import { AudioSessionController } from './audio-session.controller';
import { AudioSessionService } from './audio-session.service';

@Module({
  imports: [AudioSegmentModule, ConfigModule, HttpModule],
  controllers: [AudioSessionController],
  providers: [AudioSessionService],
  exports: [AudioSessionService],
})
export class AudioSessionModule {}
