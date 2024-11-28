import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, JwtService, PrismaService],
})
export class LinksModule {}
