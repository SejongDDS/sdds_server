import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { CategoryEntity } from "./category.entity";
import { ProductImageEntity } from "./image.entity";
import { WebsiteEntity } from "../../website/entity/website.entity";
import { IsInt, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OrdersEntity } from "../../orders/entity/orders.entity";

@Entity()
export class ProductEntity extends Core {
  @Column()
  @IsString()
  @ApiProperty()
  name: string;

  @Column()
  @IsInt()
  @ApiProperty()
  price: number;

  @Column()
  @IsInt()
  @ApiProperty()
  count: number;

  @ApiProperty()
  @ManyToOne((type) => CategoryEntity, (category) => category.products, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;

  @RelationId((self: ProductEntity) => self.category)
  category_id: number;

  @ApiProperty()
  @OneToOne((type) => ProductImageEntity, (image) => image.product, {
    cascade: true,
  })
  image: ProductImageEntity;

  @RelationId((self: ProductEntity) => self.image)
  image_id: number;

  @ApiProperty()
  @ManyToOne((type) => WebsiteEntity, (website) => website.products, {
    onDelete: "CASCADE",
  })
  website: WebsiteEntity;

  // TODO : orders, carts 추가

  @OneToMany((type) => OrdersEntity, (orders) => orders.product, {
    nullable: true,
    cascade: true,
  })
  @ApiProperty()
  orders?: OrdersEntity[];

  @RelationId((self: ProductEntity) => self.orders)
  orders_id: number;

  @BeforeInsert()
  @BeforeUpdate()
  convertStringToNumber() {
    if (typeof this.count === "string") {
      this.count = +this.count;
    }

    if (typeof this.price === "string") {
      this.price = +this.price;
    }
  }
}
