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
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Core } from "../../common/entity/core.entity";

@Entity()
@ObjectType({ isAbstract: true })
export class User extends Core {
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
  refresh_token?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async generateHashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
