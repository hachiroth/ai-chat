import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ClsService } from "nestjs-cls";
import { TCurrentUser } from "src/auth/jwt.strategy";
import { IS_PUBLIC } from "src/constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly cls: ClsService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<User extends TCurrentUser = TCurrentUser>(
    err: any,
    user: User,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): User {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    this.cls.set("user", user);
    return user;
  }
}
