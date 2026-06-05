import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
