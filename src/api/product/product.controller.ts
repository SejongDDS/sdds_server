import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { CreateProductInput, UploadFiles } from "./product.interface";
import { ProductService } from "./product.service";

@Controller("product")
@ApiTags("상품 API")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return "hello";
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProduct() {}

  // todo : 토큰으로 소유자 확인 로직 추가
  @Post()
  // @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "main_image", maxCount: 1 },
      { name: "thumbnail_image", maxCount: 1 },
    ])
  )
  @ApiOperation({
    summary: "상품 추가 API",
    description: `Form-Data 형식으로 보내야 하고 main_image(필수)와 thumbnail_image(옵션)도 추가해서 보내야함`,
  })
  @ApiBody({ type: CreateProductInput || UploadFiles })
  @ApiOkResponse()
  async createProduct(
    @Req() request,
    @UploadedFiles()
    files: UploadFiles,
    @Body() input: CreateProductInput
  ) {
    return this.productService.createProduct(files, input);
  }

  @Post("/:product_id")
  @HttpCode(HttpStatus.OK)
  async updateProduct() {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProduct() {}
}
