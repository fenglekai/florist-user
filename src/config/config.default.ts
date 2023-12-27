import { MidwayAppInfo, MidwayConfig } from '@midwayjs/core';
// eslint-disable-next-line node/no-unpublished-import
import * as conf from './config.json';
import { join } from 'path';

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: '1703033970514_5289',
    koa: {
      port: 7002,
    },
    typeorm: {
      dataSource: {
        default: {
          type: 'mariadb',
          host: conf['host'],
          port: conf['port'],
          username: conf['username'],
          password: conf['password'],
          database: conf['database'],
          // 第一次同步true,注意会数据丢失
          synchronize: true,
          logging: false,
          timezone: '+08:00',
          dateStrings: true,
          entities: ['**/entity/*.entity{.ts,.js}'],
        },
      },
    },
    jwt: {
      secret: 'midwayjs.florist', // fs.readFileSync('xxxxx.key')
      expiresIn: '2d', // https://github.com/vercel/ms
    },
    grpcServer: {
      services: [
        {
          protoPath: join(appInfo.appDir, 'proto/user.proto'),
          package: 'user',
        },
      ],
    },
  };
};
