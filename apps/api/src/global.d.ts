import "nestjs-cls";
import type * as TypeORM from "typeorm";
import type { TCurrentUser } from "./auth/jwt.strategy";

declare module "nestjs-cls" {
  interface ClsStore {
    user: TCurrentUser;
  }
}

type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** References {@linkcode TypeORM.InsertResult InsertResult} */
type _TGenericInsertResult = {
  /**
   * Contains inserted entity id.
   * Has entity-like structure (not just column database name and values).
   */
  identifiers?: TypeORM.ObjectLiteral[];
  /**
   * Generated values returned by a database.
   * Has entity-like structure (not just column database name and values).
   */
  generatedMaps?: TypeORM.ObjectLiteral[];
};

declare module "typeorm" {
  interface Repository<Entity extends object> {
    insert<T extends _TGenericInsertResult = Required<_TGenericInsertResult>>(
      entity:
        | TypeORM.QueryDeepPartialEntity<Entity>
        | TypeORM.QueryDeepPartialEntity<Entity>[],
    ): Promise<Prettify<Omit<TypeORM.InsertResult, keyof T> & T>>;
  }
}
