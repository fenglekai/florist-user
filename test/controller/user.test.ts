import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { IMidwayKoaApplication } from '@midwayjs/koa';

describe('test/controller/user.test.ts', () => {

  let app: IMidwayKoaApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await close(app);
  });

  it('POST /register 短名称用户', async () => {
    // make request
    const result = await createHttpRequest(app).post('/register').send({
      username: 'test',
      password: '123',
    });

    // use expect by jest
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('POST /register 不存在权限', async () => {
    // make request
    const result = await createHttpRequest(app).post('/register').send({
      username: 'test123',
      password: '123456',
      role: 'super admin',
    });

    // use expect by jest
    expect(result.status).toBe(422);
    expect(result.body.success).toBe(false);
  });

  it('POST /register 存在的用户', async () => {
    // make request
    const result = await createHttpRequest(app).post('/register').send({
      username: 'test123',
      password: '123456',
      role: 'admin',
    });

    // use expect by jest
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });

  it('POST /login 短名称用户', async () => {
    // make request
    const result = await createHttpRequest(app).post('/login').send({
      username: 'test',
      password: '123',
    });

    // use expect by jest
    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
  });
  it('POST /login 正常登录', async () => {
    // make request
    const result = await createHttpRequest(app).post('/login').send({
      username: 'test123',
      password: '123456',
    });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);

  });
});
