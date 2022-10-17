import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ORDER_STATUS, OrdersEntity } from "./entity/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrdersInput, CreateOrdersOutput } from "./dto/create-orders.dto";
import { WebsiteService } from "../website/website.service";
import { ProductRepositoryService } from "../product/product-repository.service";
import { IPagination } from "../../common/pagination/pagination.interface";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    private readonly websiteService: WebsiteService,
    private readonly productRepositoryService: ProductRepositoryService
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  /**
   * 주문 전체 조회
   * @param userId
   * @param websiteUrl
   * @param option
   */
  async getMyOrders(userId: number, websiteUrl: string, option: IPagination) {
    const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
    if (!website || (website && website.owner_id !== userId)) {
      return {
        ok: false,
        error: "Not Found This Website or Can't Access",
      };
    }

    const orders = this.ordersRepository.find({
      where: {
        website: {
          id: website.id,
        },
      },
      order: {
        created_at: option.order,
      },
      skip: option.skip,
      take: option.take,
      relations: ["product", "buyer"],
    });

    return orders;
  }

  /**
   * 주문 1개 조회
   * @param userId
   * @param websiteUrl
   * @param orderId
   */
  async getMyOrder(userId: number, websiteUrl: string, orderId: number) {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      if (!website || (website && website.owner_id !== userId)) {
        return {
          ok: false,
          error: "Not Found This Website or Can't Access",
        };
      }

      const orders = await this.ordersRepository.findOne({
        where: {
          website: {
            id: website.id,
          },
          id: orderId,
        },
        relations: ["product", "buyer"],
      });

      return orders;
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * 주문 생성
   * @param input
   */
  async createOrders(input: CreateOrdersInput): Promise<CreateOrdersOutput> {
    try {
      const product = await this.productRepositoryService.findOneById(
        input.product_id
      );
      if (!product) {
        this.logger.error("Not Found Product : " + input.product_id);
        return {
          ok: false,
          error: new NotFoundException(),
        };
      }

      const website = await this.websiteService.findWebsiteByUrl(
        input.website_url
      );
      if (!website) {
        this.logger.error("Not Found Website : " + input.website_url);
        return {
          ok: false,
          error: new NotFoundException(),
        };
      }

      const newOrder = await this.ordersRepository.create({
        order_status: ORDER_STATUS.PENDING,
        count: input.count,
        shipping_address: input.shipping_address,
        product: product,
        website: website,
      });

      product.orders.push(newOrder);
      website.orders.push(newOrder);

      await this.websiteService.updateWebsiteEntity(website);
      await this.productRepositoryService.updateProductEntity(product);
      await this.ordersRepository.save(newOrder);

      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
}
