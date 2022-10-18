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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@Controller("member")
@ApiTags("Member API")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post(":website_url")
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
  async signUp(@Param("website_url") websiteUrl, @Body() input: SignUpInput) {
    return await this.memberService.signUp(input, websiteUrl);
  }
}
