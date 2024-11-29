import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinkCleanupService {
  constructor(private readonly prisma: PrismaService) {
    this.scheduleLinkCleanup();
  }

  private scheduleLinkCleanup() {
    // Agendar a tarefa para rodar a cada 24 horas
    cron.schedule('0 0 * * *', async () => {
      await this.deleteExpiredLinks();
    });
  }

  private async deleteExpiredLinks() {
    const now = new Date();
    await this.prisma.link.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    console.log('Links expirados deletados com sucesso.');
  }
}
