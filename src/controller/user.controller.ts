import {
  Inject,
  Controller,
  Post,
  Body,
  Query,
  Get,
  httpError,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { UserDTO, UserRegisterDTO } from '../dto/user.dto';

@Controller('/')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() user: UserRegisterDTO) {
    const { username, password, checkPassword, role } = user;
    if (password !== checkPassword) {
      throw new httpError.BadRequestError('密码不一致');
    }
    const data = await this.userService.register(
      username,
      password,
      checkPassword,
      role
    );
    return { success: true, message: 'OK', data };
  }

  @Post('/login')
  async login(@Body() user: UserDTO) {
    const { username, password } = user;
    const data = await this.userService.login(username, password);
    return {
      success: true,
      message: 'OK',
      data,
    };
  }

  @Get('/verify')
  async verify(@Query('code') code: string) {
    try {
      await this.userService.jwt.verify(code, {
        complete: true,
      });
    } catch (error) {
      throw new httpError.UnauthorizedError(error);
    }
    return { success: true, message: 'OK' };
  }
}
