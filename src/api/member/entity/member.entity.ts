import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";
import { OrdersEntity } from "../../orders/entity/orders.entity";
import { WebsiteEntity } from "../../website/entity/website.entity";
import * as bcrypt from "bcrypt";

@Entity()
export class MemberEntity extends Core {
  @ApiProperty()
  @Column()
  @IsString()
  login_id: string;

  @ApiProperty()
  @Column({ select: false })
  @IsString()
  password: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  phone: string;

  @ApiProperty()
  @Column()
  @IsString()
  birth: string;

  @OneToMany((type) => OrdersEntity, (orders) => orders.buyer, {
    cascade: true,
    nullable: true,
  })
  orders?: OrdersEntity[];

  @ManyToOne((type) => WebsiteEntity, (website) => website.members, {
    onDelete: "CASCADE",
  })
  website: WebsiteEntity;

  @RelationId((self: MemberEntity) => self.website)
  website_id: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
