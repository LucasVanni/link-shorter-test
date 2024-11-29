import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
