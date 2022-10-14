import { Column, Entity, ManyToOne, OneToOne, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { CategoryEntity } from "./category.entity";
import { ProductImageEntity } from "./image.entity";
import { WebsiteEntity } from "../../website/entity/website.entity";
import { IsInt, IsString } from "class-validator";

@Entity()
export class ProductEntity extends Core {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsInt()
  price: number;

  @Column()
  @IsInt()
  count: number;

  @ManyToOne((type) => CategoryEntity, (category) => category.products, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;

  @RelationId((self: ProductEntity) => self.category)
  category_id: number;

  @OneToOne((type) => ProductImageEntity, (image) => image.product, {
    cascade: true,
  })
  image: ProductImageEntity;

  @RelationId((self: ProductEntity) => self.image)
  image_id: number;

  @ManyToOne((type) => WebsiteEntity, (website) => website.products, {
    onDelete: "CASCADE",
  })
  website: WebsiteEntity;

  // TODO : orders, carts 추가
}
