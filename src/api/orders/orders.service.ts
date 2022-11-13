import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ORDER_CANCEL,
  ORDER_CHECK,
  ORDER_STATUS,
  OrdersEntity,
} from "./entity/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrdersInput, CreateOrdersOutput } from "./dto/create-orders.dto";
import { WebsiteService } from "../website/website.service";
import { ProductRepositoryService } from "../product/product-repository.service";
import { IPagination } from "../../common/pagination/pagination.interface";
import { UpdateOrdersInput, UpdateOrdersOutput } from "./dto/update-orders.dto";
import { DeleteOrdersOutput } from "./dto/delete-orders.dto";

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

      if (orders) {
        await this.ordersRepository.update(orders.id, {
          order_check: ORDER_CHECK.CHECKED,
        });
      }

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
        order_check: ORDER_CHECK.NOT_YET,
        order_cancel: ORDER_CANCEL.NO_CANCEL,
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

  async requestCancelOrder(orderId: number) {
    try {
      const order = await this.ordersRepository.findOne({
        where: {
          id: orderId,
        },
      });
      await this.ordersRepository.update(order.id, {
        order_cancel: ORDER_CANCEL.NOT_YET,
      });
      return;
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * 주문 업데이트
   * @param userId
   * @param orderId
   * @param input
   */
  async updateOrder(
    userId: number,
    orderId: number,
    input: UpdateOrdersInput
  ): Promise<UpdateOrdersOutput> {
    try {
      const order = await this.ordersRepository.findOne({
        where: {
          id: orderId,
          website: {
            owner: {
              id: userId,
            },
          },
        },
      });

      if (!order) {
        return {
          ok: false,
          error: "Not Found Order or Can't Access this Order",
        };
      }

      const updatedOrder = this.ordersRepository.create({
        ...order,
        ...input,
      });

      await this.ordersRepository.save(updatedOrder);

      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async deleteOrder(
    userId: number,
    orderId: number
  ): Promise<DeleteOrdersOutput> {
    try {
      const order = await this.ordersRepository.findOne({
        where: {
          id: orderId,
        },
        relations: ["website", "website.owner"],
      });

      if (!order) {
        return {
          ok: false,
          error: new NotFoundException(),
        };
      }

      if (order.website.owner_id !== userId) {
        return {
          ok: false,
          error: new UnauthorizedException(),
        };
      }

      await this.ordersRepository.delete(order.id);
      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
