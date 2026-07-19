import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty({
    message: "Username is required.",
  })
  @Length(3, 20, {
    message: "Username must be between 3 and 20 characters.",
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username may contain only letters, numbers, and underscores.",
  })
  username!: string;

  @IsString()
  @IsNotEmpty({
    message: "Password is required.",
  })
  @Length(8, 32, {
    message: "Password must be between 8 and 32 characters.",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
  })
  password!: string;

  autoLogin?: boolean;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty({
    message: "Username is required.",
  })
  username!: string;

  @IsString()
  @IsNotEmpty({
    message: "Password is required.",
  })
  password!: string;
}
