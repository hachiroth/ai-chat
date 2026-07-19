import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC } from "src/constants";

/**
 * Decorator that marks a class or method as a public route.
 */
export const Public = () => SetMetadata(IS_PUBLIC, true);
