import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtGuard } from "./guards/jwt.guard";
import { CurrentUser } from "./decorator/current-user.decorator";
import { User } from "../user/entity/user.entity";
import { GetUserFromToken } from "./dto/get-user-from-token";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { UserFromRefreshToken } from "./dto/get-user-from-jwt.dto";
import Ctx from "../common/types/context.type";
import { UpdateTokensOutput } from "./dto/update-tokens.dto";

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

  @UseGuards(JwtRefreshGuard)
  @Query((type) => UpdateTokensOutput)
  async updateTokens(
    @CurrentUser() user: UserFromRefreshToken,
    @Context() context: Ctx
  ) {
    const { user_id } = user;
    return await this.authService.updateTokens(user_id, context);
  }
}
