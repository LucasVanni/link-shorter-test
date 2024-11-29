import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LinksService } from './links.service';

describe('LinksService', () => {
  let service: LinksService;

  const link = {
    id: 'link-id',
    url: 'https://www.example.com',
    shortUrl: 'short-url',
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    links: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: { decode: jest.fn() } },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should throw an exception if the user is not found on update', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateLink(link.id, link.url, link.shortUrl),
      ).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the user is not found on delete', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteLink(link.shortUrl, 'invalid-token'),
      ).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getLink', () => {
    it('should throw an exception if the link is not found', async () => {
      mockPrismaService.links.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getLinks('non-existent-short-url')).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND),
      );
    });
  });
});
