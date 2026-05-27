import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailDTO {
  @ApiProperty()
  @IsString()
  token: string;
}
