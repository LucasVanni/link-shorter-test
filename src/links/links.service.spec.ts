import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LinksService } from './links.service';

describe('LinksService', () => {
  let service: LinksService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const user = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'securepassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const link = {
    id: 'link-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    url: 'https://www.example.com',
    shortUrl: 'short-url',
    clicks: 0,
    userId: 'user-id',
    deletedAt: null,
  };

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
  });

  afterEach(async () => {
    await prisma.link.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService, PrismaService, JwtService],
    }).compile();

    service = module.get<LinksService>(LinksService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      const url = 'https://www.example.com';
      const token = 'Bearer token';

      jest.spyOn(jwtService, 'decode').mockReturnValue({ email: user.email });
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(prisma.link, 'create').mockResolvedValue(link);
      jest.spyOn(service, 'shortenUrl').mockResolvedValue(link.shortUrl);

      const result = await service.shortenUrl(url, token);
      expect(result).toContain(link.shortUrl);
    });

    it('should throw an exception if the user is not found on update', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.link, 'create').mockResolvedValue(link);
      jest.spyOn(service, 'shortenUrl').mockResolvedValue(link.shortUrl);

      await expect(
        service.updateLink(link.id, link.url, link.shortUrl),
      ).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an exception if the user is not found on delete', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.deleteLink(link.shortUrl, 'invalid-token'),
      ).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
