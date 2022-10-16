import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { AuthService } from "./auth.service";

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

  // @UseGuards(JwtRefreshGuard)
  // @Query((type) => UpdateTokensOutput)
  // async updateTokens(
  //   @CurrentUser() user: UserFromRefreshToken,
  //   @Context() context: Ctx
  // ) {
  //   const { user_id } = user;
  //   return await this.authService.updateTokens(user_id, context);
  // }
}
