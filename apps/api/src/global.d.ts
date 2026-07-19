import "nestjs-cls";
import type { TCurrentUser } from "./auth/jwt.strategy";

declare module "nestjs-cls" {
  interface ClsStore {
    user: TCurrentUser;
  }
}
