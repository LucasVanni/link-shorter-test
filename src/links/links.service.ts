import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Link, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async shortenUrl(url: string, token: string): Promise<string> {
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

    return shortUrl;
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

    return link?.url || null;
  }
}
