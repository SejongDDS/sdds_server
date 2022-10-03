import { Column, Entity, OneToOne, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "./product.entity";

@Entity()
export class ProductImageEntity extends Core {
  @Column("varchar", { nullable: true })
  thumbnail_url?: string;

  @Column("varchar", { nullable: true })
  main_url?: string;

  @OneToOne((type) => ProductEntity, (product) => product.image, {
    onDelete: "CASCADE",
  })
  product?: ProductEntity;

  @RelationId((self: ProductImageEntity) => self.product)
  product_id;
}
