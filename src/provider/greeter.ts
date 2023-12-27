import { MSProviderType, Provider, GrpcMethod, Inject } from '@midwayjs/core';
import { user } from '../domain/user';
import { UserService } from '../service/user.service';

/**
 * 实现 user.Greeter 接口的服务
 */
@Provider(MSProviderType.GRPC, { package: 'user' })
export class Greeter implements user.Greeter {
  @Inject()
  userService: UserService;

  @GrpcMethod()
  async login(request: user.LoginRequest) {
    const { username, password } = request;
    const data = await this.userService.login(username, password);
    return {
      success: true,
      message: 'OK',
      data,
    };
  }
  @GrpcMethod()
  async register(request: user.RegisterRequest) {
    const { username, password, checkPassword, role } = request;
    const data = await this.userService.register(
      username,
      password,
      checkPassword,
      role as RoleOptions
    );
    return { success: true, message: 'OK', data };
  }
  @GrpcMethod()
  async verify(request: user.VerifyRequest) {
    const { code } = request;
    try {
      await this.userService.jwt.verify(code, {
        complete: true,
      });
    } catch (error) {
      return { success: false, message: error };
    }
    return { success: true, message: 'OK' };
  }
}
