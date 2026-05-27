import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dtos/send-mail.dto';
import { confirmEmailTemplate } from './templates/confirm-email';
import { forgotPasswordTemplate } from './templates/forgot-password';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(dto: SendMailDto) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: dto.to,
        subject: dto.subject,
        html: dto.html,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao enviar email');
    }
  }

  async sendConfirmEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/confirm-email?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Email Confirmation',
      html: confirmEmailTemplate(url),
    });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const url = `${frontendUrl}/reset-password?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Password Recovery',
      html: forgotPasswordTemplate(url),
    });
  }
}
