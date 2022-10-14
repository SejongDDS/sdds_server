import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductInput } from "../product.interface";
import { IsString } from "class-validator";
import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ProductEntity } from "../entity/product.entity";

export class UpdateProductInput extends PartialType(CreateProductInput) {
  @ApiProperty()
  @IsString()
  website_url: string;
}

export class UpdateProductOutput extends CoreOutput {
  @ApiProperty()
  product?: ProductEntity;
}
