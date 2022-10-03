import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

@Controller("product")
export class ProductController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProduct() {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct() {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async updateProduct() {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProduct() {}
}
