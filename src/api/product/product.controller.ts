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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";
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

  /**
   * 상품 추가 API
   * @param request
   * @param files
   * @param input
   */
  @Post()
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

  /**
   * 상품 수정 API
   * @param req
   * @param input
   * @param product_id
   */
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

  /**
   * 상품 삭제 API
   * @param req
   * @param projectId
   * @param websiteUrl
   */
  @Delete("/:product_id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiParam({
    name: "프로젝트 id",
    type: "number",
  })
  @ApiOperation({
    summary: "상품 삭제 API",
    description: "상품 삭제",
  })
  @ApiQuery({
    name: "website_url",
    type: "string",
  })
  async deleteProduct(
    @Req() req,
    @Param("project_id") projectId,
    @Query("website_url") websiteUrl
  ) {
    const { user_id } = req.user;
    return await this.productService.deleteProduct(
      user_id,
      projectId,
      websiteUrl
    );
  }
}
