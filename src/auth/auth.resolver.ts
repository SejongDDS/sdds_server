import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "./guards/jwt.guard";
import { CurrentUser } from "./decorator/current-user.decorator";
import { User } from "../user/entity/user.entity";
import { GetUserFromToken } from "./dto/get-user-from-token";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * @param loginInput
   */
  @Mutation((type) => LoginOutput)
  async login(
    @Args("loginInput") loginInput: LoginInput
  ): Promise<LoginOutput> {
    return await this.authService.login(
      loginInput.login_id,
      loginInput.password
    );
  }
}
