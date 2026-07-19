import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseColumn } from "./_base.column";
import { User } from "./user.entity";

@Entity()
export class Conversation extends BaseColumn {
  @Column()
  title!: string;

  @ManyToOne(() => User, (user) => user.conversations, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
