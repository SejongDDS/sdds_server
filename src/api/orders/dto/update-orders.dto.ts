import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateOrdersInput } from "./create-orders.dto";
import { ORDER_STATUS } from "../entity/orders.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";

export class UpdateOrdersInput extends PickType(CreateOrdersInput, [
  "count",
  "shipping_address",
]) {
  @ApiProperty({
    type: "enum",
    enum: ORDER_STATUS,
  })
  order_status?: ORDER_STATUS;
}

export class UpdateOrdersOutput extends CoreOutput {}
