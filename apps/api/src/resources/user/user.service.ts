import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { hashPassword } from '@utils/auth_utils';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(data: CreateUserDTO) {
    let token: string | null = null;
    while (!token) {
      const candidate_token = randomBytes(32).toString('hex');

      const possible_user =
        await this.findByEmailVerificationToken(candidate_token);
      if (possible_user) {
        continue;
      }

      token = candidate_token;
    }

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await hashPassword(data.password),
        emailVerificationToken: token,
        emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    await this.mailService.sendConfirmEmail(user.email, token);

    return user;
  }

  async confirmEmail(token: string) {
    const user = await this.findByEmailVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    if (
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      throw new BadRequestException('Token expired');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    });

    return true;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return true;
    }

    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    await this.mailService.sendForgotPasswordEmail(user.email, token);

    return true;
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid Token');
    }

    if (
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt < new Date()
    ) {
      throw new BadRequestException('Expired token');
    }

    const hashedPassword = await hashPassword(password);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    return true;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        sessions: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        sessions: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findByEmailVerificationToken(token: string) {
    return this.prisma.user.findUnique({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  update(id: string, data: Partial<{ name: string; email: string }>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
