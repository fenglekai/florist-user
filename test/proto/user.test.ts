import { createApp, close } from '@midwayjs/mock';
import { createGRPCConsumer } from '@midwayjs/grpc';
import { join } from 'path';
import { user } from '../../src/domain/user';
import { IMidwayKoaApplication } from '@midwayjs/koa';

describe('test/index.test.ts', () => {
  let app: IMidwayKoaApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create multiple grpc service in one server', async () => {
    const baseDir = join(__dirname, '../../');

    // 调用服务
    const service = await createGRPCConsumer<user.GreeterClient>({
      package: 'user',
      protoPath: join(baseDir, 'proto', 'user.proto'),
      url: 'localhost:6565',
    });

    const result = await service.login().sendMessage({
      username: 'test123',
      password: '123456'
    });

    expect(result.success).toEqual(true);
    expect(result.message).toEqual('OK');
    expect(result.data?.username).toEqual('test123');
  });
});
