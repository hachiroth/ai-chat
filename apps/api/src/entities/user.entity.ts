import { Column, Entity } from "typeorm";
import { BaseColumn } from "./_base.column";

@Entity()
export class User extends BaseColumn {
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ name: "is_premium" })
  isPremium?: boolean = false;
}
