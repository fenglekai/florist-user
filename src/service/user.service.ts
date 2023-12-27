import { Inject, Provide, httpError } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { hash, genSalt, compare } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { RoleOptions } from '../dto/user.dto';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';

@Provide()
export class UserService {
  @Inject()
  ctx: Context;

  @Inject()
  jwt: JwtService;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async createHash(password: string) {
    const salt = await genSalt(10);
    const result = await hash(password, salt);
    return result;
  }

  async register(
    username: string,
    password: string,
    checkPassword: string,
    role: RoleOptions = RoleOptions.GUEST
  ) {
    // 判断username和password的长度
    if (username.length < 6 || password.length < 6) {
      throw new httpError.BadRequestError('用户名或密码长度不能小于6');
    }
    if (password !== checkPassword) {
      throw new httpError.BadRequestError('密码不一致');
    }
    // 搜索用户名判断重复
    const findUser = await this.userModel.findOne({ where: { username } });
    if (findUser) {
      throw new httpError.BadRequestError('用户名已存在');
    }
    const user = new User();
    user.username = username;
    user.password = await this.createHash(password);
    user.uuid = uuidV4();
    user.role = role;
    const result = await this.userModel.save(user);
    const data = {
      userId: result.id,
      username: result.username,
      role: result.role,
    };
    return data;
  }

  async login(username: string, password: string) {
    // 判断username和password的长度
    if (username.length < 6 || password.length < 6) {
      throw new httpError.BadRequestError('用户名或密码长度不能小于6');
    }
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new httpError.BadRequestError('用户名不存在');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new httpError.BadRequestError('密码错误');
    }
    const data = {
      userId: user.id,
      username: user.username,
      role: user.role,
      authorization: '',
    };
    const token = await this.jwt.sign(data);
    data.authorization = token;
    if (this.ctx.set) {
      this.ctx.set('Authorization', 'Bearer ' + token);
    }
    return data;
  }

  async logout() {
    this.ctx.set('Authorization', '');
    return 'OK';
  }

  async setUserRole(userId: number, role: RoleOptions) {
    const user = await this.userModel.findOne({ where: { id: userId } });
    if (!user) {
      throw new httpError.BadRequestError('用户不存在');
    }
    user.role = role;
    const result = await this.userModel.save(user);
    return result;
  }

  async getUserList() {
    const data = await this.userModel.find();
    return data;
  }
}
