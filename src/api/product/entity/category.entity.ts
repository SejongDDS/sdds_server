import { Column, Entity, OneToMany } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class CategoryEntity extends Core {
  @Column("varchar")
  @ApiProperty()
  name: string;

  @OneToMany((type) => ProductEntity, (product) => product.category, {
    nullable: true,
  })
  products?: ProductEntity;
}
