import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "src/decorators/public.decorator";
import { SignInDto, SignUpDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post("sign-in")
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
