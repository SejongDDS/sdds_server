import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateWebsiteInput, CreateWebsiteOutput } from "./website.interface";

@Controller("website")
@ApiTags("웹사이트 API")
@ApiBearerAuth("access-token")
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "웹사이트 생성 API",
    description: "Authorization Bearer 헤더에 추가",
  })
  @ApiCreatedResponse({
    type: CreateWebsiteOutput,
  })
  async createWebsite(
    @Req() req,
    @Body() input: CreateWebsiteInput
  ): Promise<CreateWebsiteOutput> {
    return await this.websiteService.createWebsite(req.user.id, input);
  }
}
