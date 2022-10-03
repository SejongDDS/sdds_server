import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CategoryService } from "./category.service";
import { ProductImageService } from "./product-image.service";
import { ProductController } from "./product.controller";

@Module({
  providers: [ProductService, CategoryService, ProductImageService],
  controllers: [ProductController],
})
export class ProductModule {}
