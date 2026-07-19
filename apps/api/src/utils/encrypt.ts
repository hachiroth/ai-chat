/* eslint-disable @typescript-eslint/no-unsafe-return */

import { hash, verify } from "argon2";

export const encryptPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await verify(hash, password);
};
