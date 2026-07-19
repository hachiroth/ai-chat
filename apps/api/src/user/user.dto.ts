import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(18)
  password!: string;
}
