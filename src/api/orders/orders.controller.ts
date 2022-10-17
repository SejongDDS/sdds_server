import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateOrdersInput, CreateOrdersOutput } from "./dto/create-orders.dto";
import { OrdersService } from "./orders.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { IPagination } from "../../common/pagination/pagination.interface";
import { DocumentPagination } from "../../common/pagination/pagination.decorator";
import { OrdersEntity } from "./entity/orders.entity";

@Controller("orders")
@ApiTags("주문 API")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 주문 전체 조회
   * @param req
   * @param websiteUrl
   * @param option
   */
  @Get("/:website_url")
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: "주문 전체 조회 API",
  })
  @ApiOkResponse({
    description: "OrdersEntity[]",
  })
  @DocumentPagination()
  async getMyOrders(
    @Req() req,
    @Param("website_url") websiteUrl,
    @Query() option: IPagination
  ) {
    const { user_id } = req.user;
    return await this.ordersService.getMyOrders(user_id, websiteUrl, option);
  }

  /**
   * 주문 1개 조회
   * @param req
   * @param params
   */
  @Get("/:website_url/:order_id")
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: "주문 조회 API",
  })
  @ApiOkResponse({
    type: OrdersEntity,
  })
  async getMyOrder(@Req() req, @Param() params) {
    const { user_id } = req.user;
    const { website_url, order_id } = params;
    return await this.ordersService.getMyOrder(user_id, website_url, order_id);
  }

  /**
   * 주문 생성
   * @param input
   */
  @Post()
  @ApiOperation({
    summary: "주문 생성 API",
    description: "웹 사이트의 주문 생성",
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: CreateOrdersOutput,
  })
  @ApiBody({
    type: CreateOrdersInput,
    description: "CreateOrdersInput",
  })
  async createOrders(
    @Body() input: CreateOrdersInput
  ): Promise<CreateOrdersOutput> {
    return await this.ordersService.createOrders(input);
  }
}
