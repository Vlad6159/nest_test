import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id);
    const { password, ...user }: UserDto =
      await this.UserService.findUserById(userId);
    return {
      user,
    };
  }
  @Post('/signup')
  async createUser(@Body() body: UserDto) {
    const user = await this.UserService.createUser(body);
    return {
      message: 'Пользователь успешно создан',
      status: '201',
    };
  }

  @Post('/signin')
  async authUser(@Body() body: UserDto) {
    const user = await this.UserService.authorizeUser(body);
    return {
      message: 'Пользователь успешно авторизован',
    };
  }
}
