import { Body, Controller, Get, Param } from '@nestjs/common';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  @Get(':id')
  getUserById(@Param('id') id: number) {
    const user: UserDto = {
      name: '',
      password: '',
      email: '',
    };

    return user;
  }
  createUser(@Body() body: UserDto) {
    return {
      message: 'User was succesfully created',
      status: '201',
    };
  }
}
