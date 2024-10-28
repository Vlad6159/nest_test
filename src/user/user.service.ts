import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import passwordUtils from 'argon/argon';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: UserDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const uniqueEmail = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (uniqueEmail) {
          throw new ConflictException('Данная почта уже используется');
        }

        data.password = await passwordUtils.hashPassword(data.password);

        return await this.prisma.user.create({ data });
      });
    } catch (e) {
      throw e;
    }
  }
  async findUserById(userId: number) {
    try {
      return await this.prisma.user.findFirstOrThrow({ where: { id: userId } });
    } catch (e) {
      throw e;
    }
  }

  async authorizeUser(data: UserDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const user = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (
          !user ||
          !(await passwordUtils.verifyPassword(user.password, data.password))
        ) {
          throw new UnauthorizedException('Неверно указана почта или пароль');
        }
      });
    } catch (e) {
      throw e;
    }
  }
}
