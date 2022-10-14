import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./entity/product.entity";
import {
  CreateProductInput,
  CreateProductOutput,
  UploadFiles,
} from "./product.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "./category.service";
import { ProductImageService } from "./product-image.service";
import { WebsiteService } from "../website/website.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
    private readonly imageService: ProductImageService,
    private readonly websiteService: WebsiteService
  ) {}
  private readonly logger = new Logger(ProductService.name);

  async createProduct(
    userId: number,
    files: UploadFiles,
    input: CreateProductInput
  ): Promise<CreateProductOutput> {
    try {
      // 카테고리 생성
      const category = await this.categoryService.findCategory(
        input.category_name
      );
      // 웹사이트 조회
      const website = await this.websiteService.findWebsiteByUrl(
        input.website_url
      );
      if (!website || website.owner_id !== userId) {
        this.logger.error(`${input.website_url} is not found`);
        return {
          ok: false,
          error: new NotFoundException(),
          statusCode: 401,
        };
      }

      const image = await this.imageService.createImage(
        files,
        input.website_url
      );

      // 상품 생성
      const product = this.productRepository.create({
        name: input.name,
        price: +input.price,
        count: +input.count,
        category: category,
        website: website,
        image: image,
      });
      await this.productRepository.save(product);

      // 이미지 업로드
      image.product = product;
      await this.imageService.updateImageEntity(image);

      // 웹사이트 업데이트
      if (!website.products) {
        website.products = [];
      }
      website.products.push(product);
      await this.websiteService.updateWebsiteEntity(website);

      return {
        ok: true,
        statusCode: 200,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        ok: false,
        statusCode: 500,
        error: e,
      };
    }
  }
}
