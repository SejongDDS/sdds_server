import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entity/product.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepositoryService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productService: Repository<ProductEntity>
  ) {}

  async findOneById(product_id: number): Promise<ProductEntity> {
    const product = await this.productService.findOne({
      where: {
        id: product_id,
      },
      relations: ["website", "orders", "image", "category"],
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async updateProductEntity(product: ProductEntity) {
    return await this.productService.save(product);
  }
}
