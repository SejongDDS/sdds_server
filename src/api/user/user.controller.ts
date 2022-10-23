import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { CreateUserInput, CreateUserOutput } from "./dto/sign-up.dto";

@Controller("/user")
@ApiTags("유저 API")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUser(@Req() req) {
    return await this.userService.getUser(req.user.id);
  }

  @Post("/sign-up")
  @ApiOperation({
    summary: "회원 가입 API",
  })
  @ApiCreatedResponse({
    type: CreateUserOutput,
  })
  @ApiAcceptedResponse({
    description: "존재하는 정보가 있을 때(아이디, 휴대폰 번호, 이메일)",
  })
  async signUp(@Body() input: CreateUserInput) {
    return await this.userService.signUp(input);
  }
}
