import { Column, Entity, OneToMany, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "../../product/entity/product.entity";

@Entity()
export class WebsiteEntity extends Core {
  @Column("varchar", { unique: true })
  website_url: string;

  @OneToMany((type) => ProductEntity, (product) => product.website, {
    cascade: true,
  })
  products: ProductEntity[];

  @RelationId((self: WebsiteEntity) => self.products)
  products_id: number[];
}
