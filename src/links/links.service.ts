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
      where: {
        userId: user?.id,
        tenantId: user?.tenantId,
        deletedAt: null,
      },
      select: {
        clicks: true,
        shortUrl: true,
        url: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async shortenUrl(
    url: string,
    token?: string,
    host?: string,
  ): Promise<string> {
    const domain = `http://${host || 'localhost:3000'}`;

    let user: User | null = null;
    try {
      if (token) {
        const decodedToken = this.jwtService.decode(
          token.replace('Bearer ', ''),
        );

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
          tenantId: user ? user.tenantId : null,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      return `${domain}/links/${shortUrl}`;
    } catch {
      throw new HttpException(
        'Erro ao criar link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLinkAnalytics(shortUrl: string, token: string) {
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

    const link = await this.prisma.link.findFirst({
      where: { shortUrl, userId: user.id },
    });

    if (!link) {
      throw new HttpException('Link não encontrado', HttpStatus.NOT_FOUND);
    }

    return {
      clicks: link.clicks,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async getLongUrl(shortUrl: string, token: string): Promise<string | null> {
    const decodedToken = this.jwtService.decode(token?.replace('Bearer ', ''));

    const userEmail = decodedToken?.email;

    let link: Link | null = null;

    try {
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
    } catch {
      throw new HttpException(
        'Erro ao obter link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    try {
      await this.prisma.link.update({
        where: { id: link?.id },
        data: {
          url: longUrl,
        },
      });
    } catch {
      throw new HttpException(
        'Erro ao atualizar link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    try {
      await this.prisma.link.update({
        where: { id: link?.id },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch {
      throw new HttpException(
        'Erro ao deletar link',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
