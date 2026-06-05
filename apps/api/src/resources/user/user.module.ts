import { Module } from '@nestjs/common';
import { MailModule } from '@resources/mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
