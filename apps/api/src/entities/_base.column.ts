import { createId } from "@paralleldrive/cuid2";
import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseColumn {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  createId() {
    this.id ??= createId();
  }

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
