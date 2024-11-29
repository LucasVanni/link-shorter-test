import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Link, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getLinks(token: string): Promise<Partial<Link>[]> {
    const decodedToken = this.jwtService.decode(token.replace('Bearer ', ''));

    const userEmail = decodedToken?.email;

    if (!userEmail) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    return this.prisma.link.findMany({
      where: { userId: user?.id, deletedAt: null },
      select: {
        clicks: true,
        shortUrl: true,
        url: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async shortenUrl(url: string, token: string, host?: string): Promise<string> {
    const domain = `http://${host || 'localhost:3000'}`;

    let user: User | null = null;

    if (token) {
      const decodedToken = this.jwtService.decode(token.replace('Bearer ', ''));

      const userEmail = decodedToken?.email;

      if (userEmail) {
        user = await this.prisma.user.findUnique({
          where: { email: userEmail },
        });
      }
    }

    const shortUrl = uuidv4().slice(0, 6);

    await this.prisma.link.create({
      data: {
        url,
        shortUrl,
        userId: user ? user.id : null,
      },
    });

    return `${domain}/links/${shortUrl}`;
  }

  async getLongUrl(shortUrl: string, token: string): Promise<string | null> {
    const decodedToken = this.jwtService.decode(token?.replace('Bearer ', ''));

    const userEmail = decodedToken?.email;

    let link: Link | null = null;

    if (userEmail) {
      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        throw new HttpException(
          'Usuário não encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      link = await this.prisma.link.findFirst({
        where: { shortUrl, userId: user.id },
      });
    }

    if (!link) {
      link = await this.prisma.link.findFirst({
        where: { shortUrl },
      });
    }

    if (link?.deletedAt) {
      throw new HttpException(
        'Link não encontrado! (deleted)',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!link) {
      throw new HttpException('Link não encontrado!', HttpStatus.NOT_FOUND);
    }

    await this.prisma.link.update({
      where: { id: link?.id },
      data: { clicks: { increment: 1 } },
    });

    return link?.url || null;
  }

  async updateLink(longUrl: string, shortUrl: string, token: string) {
    const decodedToken = this.jwtService.decode(token?.replace('Bearer ', ''));
    const userEmail = decodedToken?.email || null;

    if (!userEmail) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    const link = await this.prisma.link.findFirst({
      where: { userId: user?.id, shortUrl },
    });

    if (link?.deletedAt) {
      throw new HttpException(
        'Link não encontrado! (deleted)',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.link.update({
      where: { id: link?.id },
      data: {
        url: longUrl,
      },
    });
  }

  async deleteLink(shortUrl: string, token?: string) {
    const decodedToken = this.jwtService.decode(token?.replace('Bearer ', ''));

    if (!decodedToken) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userEmail = decodedToken?.email;

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const link = await this.prisma.link.findFirst({
      where: { userId: user?.id, shortUrl },
    });

    if (link?.deletedAt) {
      throw new HttpException(
        'Link não encontrado! (deleted)',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.link.update({
      where: { id: link?.id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
