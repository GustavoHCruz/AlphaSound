import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@resources/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@resources/auth/types/auth-user.type';
import { ConfirmEmailDTO } from './dtos/confirm-email.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserResponseDTO } from './dtos/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    const data = await this.userService.create(body);
    return UserResponseDTO.fromModel(data);
  }

  @Post('confirm-email')
  confirmEmail(@Body() body: ConfirmEmailDTO) {
    return this.userService.confirmEmail(body.token);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.userService.resetPassword(body.token, body.password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@GetUser() user: AuthUser) {
    const data = await this.userService.findOne(user.userId);
    return UserResponseDTO.fromModel(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async update(@GetUser() user: AuthUser, @Body() body: UpdateUserDTO) {
    const data = await this.userService.update(user.userId, body);
    return UserResponseDTO.fromModel(data);
  }
}
