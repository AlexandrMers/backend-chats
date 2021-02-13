import { Module } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Module({
  imports: [],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
