import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "../../product/entity/product.entity";
import { User } from "../../user/entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { OrdersEntity } from "../../orders/entity/orders.entity";
import { MemberEntity } from "../../member/entity/member.entity";

@Entity()
export class WebsiteEntity extends Core {
  @Column("varchar", { unique: true })
  @ApiProperty()
  website_url: string;

  @OneToMany((type) => ProductEntity, (product) => product.website, {
    cascade: true,
    nullable: true,
  })
  @ApiProperty()
  products?: ProductEntity[];

  @RelationId((self: WebsiteEntity) => self.products)
  products_id: number[];

  @ManyToOne((type) => User, (user) => user.websites, { onDelete: "CASCADE" })
  @ApiProperty()
  owner: User;

  @RelationId((self: WebsiteEntity) => self.owner)
  owner_id: number;

  @OneToMany((type) => OrdersEntity, (orders) => orders.website, {
    nullable: true,
    cascade: true,
  })
  @ApiProperty()
  orders?: OrdersEntity[];

  @RelationId((self: WebsiteEntity) => self.orders)
  orders_id: number;

  @OneToMany((type) => MemberEntity, (member) => member.website, {
    cascade: true,
    nullable: true,
  })
  members: MemberEntity[];

  @RelationId((self: WebsiteEntity) => self.members)
  members_id: number[];
}
