import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.UnauthorizedError)
export class UnauthorizedFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = err.status || 401;
    return { success: false, message: err.message };
  }
}
