import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password',
  })
  password: string;
}
