import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Core } from "../../../common/entity/core.entity";
import { ProductEntity } from "../../product/entity/product.entity";
import { User } from "../../../user/entity/user.entity";

@Entity()
export class WebsiteEntity extends Core {
  @Column("varchar", { unique: true })
  website_url: string;

  @OneToMany((type) => ProductEntity, (product) => product.website, {
    cascade: true,
    nullable: true,
  })
  products?: ProductEntity[];

  @RelationId((self: WebsiteEntity) => self.products)
  products_id: number[];

  @ManyToOne((type) => User, (user) => user.websites, { onDelete: "CASCADE" })
  owner: User;

  @RelationId((self: WebsiteEntity) => self.owner)
  owner_id: number;
}
