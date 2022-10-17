import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CategoryService } from "./category.service";
import { ProductImageService } from "./product-image.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entity/product.entity";
import { ProductImageEntity } from "./entity/image.entity";
import { CategoryEntity } from "./entity/category.entity";
import { WebsiteModule } from "../website/website.module";
import { OrdersEntity } from "../orders/entity/orders.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      CategoryEntity,
      OrdersEntity,
    ]),
    WebsiteModule,
  ],
  providers: [ProductService, CategoryService, ProductImageService],
  controllers: [ProductController],
})
export class ProductModule {}
