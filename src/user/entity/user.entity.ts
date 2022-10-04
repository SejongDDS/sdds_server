import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";

import * as bcrypt from "bcrypt";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Core } from "../../common/entity/core.entity";
import { WebsiteEntity } from "../../api/website/entity/website.entity";

@Entity()
@ObjectType({ isAbstract: true })
export class User extends Core {
  @Column()
  @Field({ description: "로그인 시 아이디" })
  login_id: string;

  @Column({ select: false })
  @Field({ description: "selection is false" })
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

  @OneToMany((type) => WebsiteEntity, (website) => website.owner, {
    nullable: true,
  })
  websites?: WebsiteEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async generateHashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
