import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "./entity/product.entity";
import { CreateProductInput, UploadFiles } from "./product.interface";
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

  async createProduct(files: UploadFiles, input: CreateProductInput) {
    try {
      // 카테고리 생성
      const category = await this.categoryService.findCategory(
        input.category_name
      );
      // 웹사이트 조회
      const website = await this.websiteService.findWebsiteByUrl(
        input.website_url
      );
      if (!website) {
        this.logger.error(`${input.website_url} is not found`);
        return {
          ok: false,
          error: new NotFoundException(),
        };
      }
      // 이미지 업로드
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
        image: image,
        website: website,
      });
      return await this.productRepository.save(product);
    } catch (e) {
      this.logger.error(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
}
