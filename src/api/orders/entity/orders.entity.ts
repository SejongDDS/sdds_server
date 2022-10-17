import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "../../product/entity/product.entity";
import { User } from "../../user/entity/user.entity";
import { WebsiteEntity } from "../../website/entity/website.entity";

export enum ORDER_STATUS {
  PENDING,
  SHIPPING,
  COMPLETED,
}

@Entity()
export class OrdersEntity extends Core {
  @Column({ type: "enum", enum: ORDER_STATUS })
  @ApiProperty({ type: "enum", enum: ORDER_STATUS })
  order_status: ORDER_STATUS;

  @Column({ type: "int" })
  @ApiProperty({ type: "int", description: "상품 주문 갯수" })
  count: number;

  @Column({ type: "varchar" })
  @ApiProperty({ type: "string", description: "배송지 주소" })
  shipping_address: string;

  @Column({ type: "json", nullable: true })
  @ApiProperty({ type: "json | null", description: "기타 정보" })
  etc?: any;

  @ManyToOne((type) => ProductEntity, (product) => product.orders, {
    onDelete: "CASCADE",
  })
  @ApiProperty({ type: () => ProductEntity })
  product: ProductEntity;

  @RelationId((self: OrdersEntity) => self.product)
  product_id: number;

  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @ApiProperty({ type: () => User })
  buyer?: User;

  @RelationId((self: OrdersEntity) => self.buyer)
  buyer_id?: number;

  @ManyToOne((type) => WebsiteEntity, (website) => website.orders, {
    onDelete: "CASCADE",
  })
  @ApiProperty({ type: () => WebsiteEntity })
  website: WebsiteEntity;
}
