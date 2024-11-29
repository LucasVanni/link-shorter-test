import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password',
  })
  @IsNotEmpty()
  readonly password: string;
}
