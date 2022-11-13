import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateOrdersInput, CreateOrdersOutput } from "./dto/create-orders.dto";
import { OrdersService } from "./orders.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { IPagination } from "../../common/pagination/pagination.interface";
import { DocumentPagination } from "../../common/pagination/pagination.decorator";
import { OrdersEntity } from "./entity/orders.entity";
import { UpdateOrdersInput, UpdateOrdersOutput } from "./dto/update-orders.dto";
import { DeleteOrdersOutput } from "./dto/delete-orders.dto";
import * as Http from "http";

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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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

  @Post("/cancel/:order_id")
  @ApiOperation({
    summary: "취소 요청 API",
  })
  @HttpCode(HttpStatus.OK)
  async requestCancelOrder(@Param("order_id") orderId: number) {
    return await this.ordersService.requestCancelOrder(orderId);
  }

  /**
   * 주문 업데이트
   * @param req
   * @param orderId
   * @param input
   */
  @Post("/:order_id")
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: "주문 업데이트 API",
    description: "Body 는 하단에 UpdateOrdersInput 참고",
  })
  @ApiBody({
    type: UpdateOrdersInput,
  })
  @ApiOkResponse({
    type: UpdateOrdersOutput,
  })
  @ApiBearerAuth()
  async updateOrder(
    @Req() req,
    @Param("order_id") orderId,
    @Body() input: UpdateOrdersInput
  ): Promise<UpdateOrdersOutput> {
    const { user_id } = req.user;
    return await this.ordersService.updateOrder(user_id, orderId, input);
  }

  @Delete("/:order_id")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "주문 삭제 API",
  })
  @ApiOkResponse({
    type: DeleteOrdersOutput,
  })
  async deleteOrder(
    @Req() req,
    @Param("order_id") orderId
  ): Promise<DeleteOrdersOutput> {
    const { user_id } = req.user;
    return await this.ordersService.deleteOrder(user_id, orderId);
  }
}
