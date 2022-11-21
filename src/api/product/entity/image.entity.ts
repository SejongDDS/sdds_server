import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class ProductImageEntity extends Core {
  @Column("varchar", { nullable: true })
  @ApiProperty()
  thumbnail_url: string;

  @Column("varchar", { nullable: true })
  @ApiProperty()
  main_url: string;

  @OneToOne((type) => ProductEntity, (product) => product.image, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  product?: ProductEntity;

  @Column({ nullable: true })
  start: number;

  @Column({ nullable: true })
  end: number;

  @RelationId((self: ProductImageEntity) => self.product)
  product_id;
}
