import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Core } from "../../../common/entity/core.entity";
import { WebsiteEntity } from "../../website/entity/website.entity";
import { ApiProperty } from "@nestjs/swagger";
import { OrdersEntity } from "../../orders/entity/orders.entity";

@Entity()
export class User extends Core {
  @Column()
  @ApiProperty()
  login_id: string;

  @Column({ select: false })
  password: string;

  @Column()
  @ApiProperty()
  phone_number: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column({ select: false, nullable: true })
  refresh_token?: string;

  @OneToMany((type) => WebsiteEntity, (website) => website.owner, {
    nullable: true,
    cascade: true,
  })
  websites?: WebsiteEntity[];

  @OneToMany((type) => OrdersEntity, (orders) => orders.product, {
    nullable: true,
    cascade: true,
  })
  @ApiProperty()
  orders?: OrdersEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async generateHashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
