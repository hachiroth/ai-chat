import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { encryptPassword, verifyPassword } from "src/utils/encrypt";
import { SignInDto, SignUpDto } from "./auth.dto";
import { TJwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(body: SignUpDto) {
    const { username, password, autoLogin = false } = body;
    const user = await this.userService.findOne({ username });
    if (user) {
      throw new ConflictException("Username already token.");
    }
    const encryptedPassword = await encryptPassword(password);
    await this.userService.create({ ...body, password: encryptedPassword });
    let signInResult = null;
    if (autoLogin) {
      signInResult = await this.signIn(body);
    }
    return {
      message: "User registered successfully.",
      ...signInResult,
    };
  }

  async signIn(body: SignInDto) {
    const { username, password } = body;
    const user = await this.userService.findOne({ username });
    if (!user?.password || !(await verifyPassword(password, user.password))) {
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
