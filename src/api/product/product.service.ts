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
import {
  UpdateProductInput,
  UpdateProductOutput,
} from "./dto/update-product.dto";
import { IPagination } from "../../common/pagination/pagination.interface";

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

  /**
   * 전체 상품 목록 조회
   * @param websiteUrl
   * @param options
   */
  async getProducts(
    websiteUrl: string,
    options: IPagination
  ): Promise<ProductEntity[] | NotFoundException> {
    try {
      const { order, take, skip } = options;
      const products = await this.productRepository.find({
        where: {
          website: {
            website_url: websiteUrl,
          },
        },
        relations: ["website", "orders", "image", "category"],
        order: {
          created_at: order,
        },
        skip: skip,
        take: take,
      });
      const result = [];
      products.map((product) => {
        const { image, ...res } = product;
        const mainImageUrl = [];
        for (let i = 0; i <= product.image.end; i++) {
          mainImageUrl.push(`${product.image.main_url}/${i}.png`);
        }
        result.push({
          ...product,
          main_url: mainImageUrl,
          thumbnail_url: `${product.image.thumbnail_url}/0.png`,
        });
      });
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getProductsSummary(url: string, options: IPagination) {
    try {
      const products = await this.productRepository.find({
        where: {
          website: {
            website_url: `${url}`,
          },
        },
        relations: ["image", "category", "website"],
        order: {
          created_at: options.order,
        },
        skip: options.skip ?? 0,
        take: options.take ?? 10,
        select: ["id", "name", "price", "count", "image"],
      });
      const result = [];
      products.map((product) => {
        const mainImageUrl = [];
        for (let i = 0; i <= product.image.end; i++) {
          mainImageUrl.push(`${product.image.main_url}/${i}.png`);
        }
        result.push({
          id: product.id,
          name: product.name,
          price: product.price,
          count: product.count,
          main_url: mainImageUrl,
          thumbnail_url: `${product.image.thumbnail_url}/0.png`,
        });
      });
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getAProduct(url: string, productId: number) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: productId,
          website: {
            website_url: url,
          },
        },
        relations: ["category", "image", "website", "orders"],
      });

      if (!product) {
        return new NotFoundException();
      }
      const { image, website, ...result } = product;
      const mainImageUrls = [];
      for (let i = 0; i < product.image.end + 1; i++) {
        mainImageUrls.push(`${product.image.main_url}/${i}.png`);
      }
      return {
        ...result,
        main_url: mainImageUrls,
        thumbnail_url: `${product.image.thumbnail_url}/0.png`,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * 상품 추가 Service
   * @param userId
   * @param files
   * @param input
   */
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
        input.website_url,
        input.name
      );

      // 상품 생성
      const product = this.productRepository.create({
        name: input.name,
        price: +input.price,
        count: +input.count,
        category: category,
        website: website,
        image: image,
        orders: [],
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

  /**
   * 상품 수정 Service
   * @param userId
   * @param productId
   * @param input
   */
  async updateProductWithoutImage(
    userId: number,
    productId: number,
    input: UpdateProductInput
  ): Promise<UpdateProductOutput> {
    try {
      const { website_url, ...updateInput } = input;
      const website = await this.websiteService.findWebsiteByUrl(website_url);

      if (!website || (website && website.owner_id !== userId)) {
        return {
          ok: false,
          error: "You can't access this website's product",
        };
      }

      const product = await this.productRepository.findOne({
        where: {
          id: productId,
          website: {
            id: website.id,
          },
        },
      });

      if (!product) {
        return {
          ok: false,
          error: "Not Found Product",
        };
      }

      const newProduct = this.productRepository.create({
        ...product,
        ...updateInput,
      });

      await this.productRepository.save(newProduct);
      return {
        ok: true,
        product: newProduct,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * 상품 삭제 Service
   * @param userId
   * @param projectId
   * @param websiteUrl
   */
  async deleteProduct(userId: number, projectId: number, websiteUrl: string) {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      const product = await this.productRepository.findOne({
        where: {
          id: projectId,
        },
        relations: ["website"],
      });

      if (
        website.owner_id !== userId ||
        product.website.website_url !== websiteUrl
      ) {
        return {
          ok: false,
          error:
            "해당 상품의 권한이 없거나, 상품 URL 과 요청한 URL 이 일치하지 않습니다.",
        };
      }

      await this.productRepository.delete(product.id);
      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
