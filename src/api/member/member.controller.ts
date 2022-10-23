import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MemberService } from "./member.service";
import { SignUpInput, SignUpOutput } from "./dto/sign-up.dto";
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import * as Http from "http";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { GetMemberOutput, GetMembersOutput } from "./dto/get-member";

@Controller("member")
@ApiTags("Member API")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("all/:website_url")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "전체 회원 조회 API",
  })
  @ApiUnauthorizedResponse({
    description: "해당 웹사이트 권한이 없을 때",
  })
  @ApiNotFoundResponse({
    description: "해당 웹사이트가 존재하지 않을 때",
  })
  @ApiOkResponse({
    description: "멤버 목록 조회 성공",
  })
  @ApiResponse({
    type: GetMembersOutput,
  })
  @UseGuards(JwtGuard)
  async getMyMembers(@Param("website_url") websiteUrl, @Req() req) {
    const { user_id } = req.user;
    return await this.memberService.getMyMembers(websiteUrl, user_id);
  }

  @Get(":website_url/:member_id")
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "회원 조회 API (1명)",
  })
  @ApiUnauthorizedResponse({
    description: "해당 웹사이트 권한이 없을 때",
  })
  @ApiNotFoundResponse({
    description: "해당 웹사이트가 존재하지 않을 때",
  })
  @ApiOkResponse({
    description: "멤버 조회 성공",
  })
  @ApiResponse({
    type: GetMemberOutput,
  })
  async getMember(@Req() req, @Param() param): Promise<GetMemberOutput> {
    const { website_url, member_id } = param;
    const { user_id } = req.user;
    return await this.memberService.getMember(user_id, website_url, member_id);
  }

  @Post("sign-up/:website_url/")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "회원가입 API (배포된 웹사이트)",
    description: "배포된 웹사이트의 회원가입",
  })
  @ApiBody({
    type: SignUpInput,
  })
  @ApiParam({
    name: "website_url",
  })
  @ApiResponse({
    type: SignUpOutput,
  })
  @ApiAcceptedResponse({
    description: "이미 사용 중인 아이디인 경우",
  })
  @ApiCreatedResponse({
    description: "회원가입 성공",
  })
  async signUp(@Param("website_url") websiteUrl, @Body() input: SignUpInput) {
    return await this.memberService.signUp(input, websiteUrl);
  }

  @Post("login/:website_url")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "로그인 API (배포된 웹사이트)",
  })
  @ApiBody({
    type: LoginInput,
  })
  @ApiResponse({
    type: LoginOutput,
  })
  @ApiAcceptedResponse({
    description: "비밀번호가 일치하지 않을 경우",
  })
  @ApiOkResponse({
    description: "로그인 성공",
  })
  @ApiNotFoundResponse({
    description: "해당하는 아이디의 회원을 찾지 못했을 때",
  })
  async login(@Param("website_url") website_url, @Body() input: LoginInput) {
    return await this.memberService.login(website_url, input);
  }
}
