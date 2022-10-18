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
import { SignUpInput, SignUpOutput } from "./dto/sign-up.dto";
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import * as Http from "http";
import { LoginInput, LoginOutput } from "./dto/login.dto";

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
