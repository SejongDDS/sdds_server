import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
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
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateWebsiteOutput,
  })
  async createWebsite(
    @Req() req,
    @Body() input: CreateWebsiteInput
  ): Promise<CreateWebsiteOutput> {
    return await this.websiteService.createWebsite(req.user.user_id, input);
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "내 웹사이트 전체 조회",
    description:
      "내 소유 전체 웹사이트 조회 // Bearer Token 만 담아서 보내면 됩니다.",
  })
  @ApiBearerAuth()
  async getMyWebsites(@Req() req) {
    const { user_id } = req.user;
    return await this.websiteService.getMyWebsites(user_id);
  }
}
