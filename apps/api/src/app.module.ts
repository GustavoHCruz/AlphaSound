import { Module } from '@nestjs/common';
import { AudioSegmentModule } from '@resources/audio-segment/audio-segment.module';
import { AudioSessionModule } from '@resources/audio-session/audio-session.module';
import { AuthModule } from '@resources/auth/auth.module';
import { UploadModule } from '@resources/upload/upload.module';
import { UserModule } from '@resources/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AudioSegmentModule,
    AudioSessionModule,
    AuthModule,
    PrismaModule,
    UploadModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
