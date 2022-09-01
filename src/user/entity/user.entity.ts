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
import { Field, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  user_id: number;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @Column()
  @Field({ description: "로그인 시 아이디" })
  login_id: string;

  @Column({ select: false })
  @Field()
  password: string;

  @Column()
  @Field()
  phone_number: string;

  @Column()
  @Field()
  email: string;

  @Column({ select: false, nullable: true })
  @Field({ nullable: true, description: "jwt Refresh Token, 로그인 시 발급됨" })
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async generateHashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
