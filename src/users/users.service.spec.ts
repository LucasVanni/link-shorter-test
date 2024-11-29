import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    await mockPrismaService.$connect();
  });

  afterEach(async () => {
    await mockPrismaService.user.deleteMany(); // Limpa a tabela de usuários após cada teste
  });

  afterAll(async () => {
    await mockPrismaService.$disconnect();
  });

  it('should create a user', async () => {
    const userDto = {
      id: 'some-unique-id',
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      tenantId: 'tenant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.user.findFirst.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue(userDto);

    const result = await service.create(userDto);
    expect(result).toEqual({ message: 'user_created_success' });
  });

  it('should throw an exception if the user already exists', async () => {
    const userDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      tenantId: 'tenant-id',
      id: 'some-unique-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPrismaService.user.findFirst.mockResolvedValue(userDto);
    await expect(service.create(userDto)).rejects.toThrow(
      new HttpException('user_already_exist', HttpStatus.CONFLICT),
    );
  });
});
