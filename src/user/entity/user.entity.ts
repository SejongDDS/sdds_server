import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import * as bcrypt from "bcrypt";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  login_id: string;

  @Column({ select: false })
  password: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  @BeforeInsert()
  @BeforeUpdate()
  async generateHashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
