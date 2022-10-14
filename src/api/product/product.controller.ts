import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
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
import {
  CreateProductInput,
  CreateProductOutput,
  UploadFiles,
} from "./product.interface";
import { ProductService } from "./product.service";
import { UpdateProductInput } from "./dto/update-product.dto";

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
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
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
  @ApiOkResponse({
    type: CreateProductOutput,
  })
  async createProduct(
    @Req() request,
    @UploadedFiles()
    files: UploadFiles,
    @Body() input: CreateProductInput
  ): Promise<CreateProductOutput> {
    return this.productService.createProduct(
      request.user.user_id,
      files,
      input
    );
  }

  @Post("/:product_id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "상품 수정 API",
    description: `이미지를 제외한 상품 정보 수정`,
  })
  async updateProductWithoutImage(
    @Req() req,
    @Body() input: UpdateProductInput,
    @Param("product_id") product_id
  ) {
    const { user_id } = req.user;
    return this.productService.updateProductWithoutImage(
      user_id,
      product_id,
      input
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProduct() {}
}
