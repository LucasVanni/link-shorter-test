import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'URL a ser encurtada',
    example: 'https://www.example.com',
  })
  url: string;
}
