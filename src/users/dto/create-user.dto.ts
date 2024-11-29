import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '1' })
  id?: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: '2024-01-01' })
  createdAt?: Date;

  @ApiProperty({ example: 'tenant-id' })
  tenantId: string;

  @ApiProperty({ example: '2024-01-01' })
  updatedAt?: Date;
}
