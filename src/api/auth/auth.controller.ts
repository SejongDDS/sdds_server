import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginInput, LoginOutput, LoginOutput2 } from "./dto/login.dto";

@Controller()
@ApiTags("Auth API")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "로그인 API",
  })
  @ApiBody({
    type: LoginInput,
  })
  @ApiOkResponse({
    type: LoginOutput2,
  })
  async login(@Body() input: LoginInput): Promise<LoginOutput2> {
    return await this.authService.login(input.login_id, input.password);
  }
}
