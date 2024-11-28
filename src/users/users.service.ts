import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/create-auth.dto';
import { UpdatePasswordDto } from 'src/auth/dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

interface FormatLogin extends Partial<User> {
  email: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //use by user module to change user password
  async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    // compare passwords
    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { id: id.toString() },
      data: { password: await hash(payload.new_password, 10) },
    });
  }

  //use by auth module to register user in database
  async create(userDto: CreateUserDto): Promise<any> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });

    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    await this.prisma.user.create({
      data: {
        ...userDto,
        password: await hash(userDto.password, 10),
      },
    });

    return {
      message: 'user_created_success',
    };
  }

  //use by auth module to login user
  async findByLogin({ email, password }: LoginUserDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...rest } = user;

    return rest;
  }

  //use by auth module to get user in database
  async findByPayload({ email }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }
}
