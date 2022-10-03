import { Column, Entity, OneToMany } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "./product.entity";

@Entity()
export class CategoryEntity extends Core {
  @Column("varchar")
  name: string;

  @OneToMany((type) => ProductEntity, (product) => product.category)
  products: ProductEntity;
}
