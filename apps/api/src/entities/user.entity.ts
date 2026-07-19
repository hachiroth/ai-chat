import { Column, Entity, OneToMany } from "typeorm";
import { BaseColumn } from "./_base.column";
import { Conversation } from "./conversation.entity";

@Entity()
export class User extends BaseColumn {
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ name: "is_premium", default: false })
  isPremium?: boolean = false;

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations?: Conversation[];
}
