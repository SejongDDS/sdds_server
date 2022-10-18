import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from "@nestjs/common";
import { MemberService } from "./member.service";
import { SignUpInput } from "./dto/sign-up.dto";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import * as Http from "http";
import { LoginInput } from "./dto/login.dto";

@Controller("member")
@ApiTags("Member API")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
  @ApiNoContentResponse({
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
  @ApiBody({
    type: LoginInput,
  })
  async login(@Param("website_url") website_url, @Body() input: LoginInput) {
    return await this.memberService.login(website_url, input);
  }
}
