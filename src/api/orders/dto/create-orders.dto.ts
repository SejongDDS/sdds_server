import { ApiProperty } from "@nestjs/swagger";
import { CoreOutput } from "../../../common/dto/out-put.dto";

export class CreateOrdersInput {
  @ApiProperty({ type: "number", description: "상품 주문 수량" })
  count: number;

  @ApiProperty({ type: "string", description: "상품 배송지 주소" })
  shipping_address: string;

  @ApiProperty({ type: "any", description: "기타 입력 사항 (optional)" })
  etc?: any;

  @ApiProperty({ type: "string", description: "웹사이트 식별값" })
  website_url: string;

  @ApiProperty({ type: "number", description: "상품 Id 값" })
  product_id: number;

  @ApiProperty({
    type: "number",
    description: "해당 웹사이트 회원 id(일단 optional)",
  })
  user_id?: number;
}

export class CreateOrdersOutput extends CoreOutput {}
