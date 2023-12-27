import { Catch, MidwayHttpError, httpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.BadRequestError)
export class BadRequestFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = err.status || 400;
    return {
      success: false,
      message: err.message,
    };
  }
}
