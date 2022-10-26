import {
  Body,
  Controller,
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
import { WebsiteService } from "./website.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateWebsiteInput, CreateWebsiteOutput } from "./website.interface";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("website")
@ApiTags("웹사이트 API")
@ApiBearerAuth("access-token")
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "html", maxCount: 10 },
      { name: "css", maxCount: 10 },
    ])
  )
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
    @Body() input: CreateWebsiteInput,
    @UploadedFiles()
    files: {
      html: Express.Multer.File[];
      css: Express.Multer.File[];
    }
  ): Promise<CreateWebsiteOutput> {
    return await this.websiteService.createWebsite(
      req.user.user_id,
      files,
      input
    );
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

  @Get("/check/:website-url")
  @ApiOperation({
    summary: "웹사이트 URL 중복 검사",
    description: "중복이면 true, 중복이 아니면 false 반환",
  })
  @ApiOkResponse({
    schema: {
      example: true,
    },
  })
  async isDuplicateOfWebsite(@Param("website-url") websiteUrl: string) {
    return await this.websiteService.isDuplicateOfWebsite(websiteUrl);
  }
}
