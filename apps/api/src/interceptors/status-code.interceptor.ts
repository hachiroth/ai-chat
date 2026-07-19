import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";

@Injectable()
export class StatusCodeIntereptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const isUnset =
      this.reflector.get<number>(HTTP_CODE_METADATA, context.getHandler()) ===
      undefined;
    if (request.method === "POST" && isUnset) {
      response.status(HttpStatus.OK);
    }
    return next.handle();
  }
}
