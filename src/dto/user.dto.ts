import { Rule, RuleType } from '@midwayjs/validate';

export enum RoleOptions {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export class UserDTO {
  @Rule(RuleType.string().required())
  username: string;

  @Rule(RuleType.string().required())
  password: string;
}

export class UserRegisterDTO {
  @Rule(RuleType.string().required())
  username: string;

  @Rule(RuleType.string().required())
  password: string;

  @Rule(RuleType.string().required())
  checkPassword: string;

  @Rule(RuleType.string().valid(...Object.values(RoleOptions)))
  role: RoleOptions;
}
