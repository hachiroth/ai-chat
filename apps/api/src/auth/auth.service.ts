import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { SignInDto } from "./auth.dto";
import { TJwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp() {}

  async signIn(body: SignInDto) {
    const { username, password } = body;
    const user = await this.userService.findOne({ username });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload: TJwtPayload = {
      sub: user.id,
      username: user.username,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
