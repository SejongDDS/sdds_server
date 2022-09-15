import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CookieOptions, Response } from "express";
import * as bcrypt from "bcrypt";
import { LoginOutput } from "./dto/login.dto";
import { AuthJwtService } from "./jwt.service";
import { CreateTokensOutput } from "./dto/create-tokens.dto";
import Ctx from "../common/types/context.type";
import { ref } from "joi";
import { UpdateTokensOutput } from "./dto/update-tokens.dto";

const cookieOptions: CookieOptions = {
  domain: "localhost:3000",
  httpOnly: false,
  secure: false,
  sameSite: true,
  path: "/graphql",
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService
  ) {}

  async validateUser(loginId: string, password: string) {
    const user = await this.userService.findUserForLogin(loginId);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(id: string, password: string): Promise<LoginOutput> {
    try {
      const user = await this.validateUser(id, password);
      // id 와 password 가 맞지 않을 때
      if (!user) {
        return {
          ok: false,
          error: "Not Match id and password",
          statusCode: 401,
        };
      }

      // jwt token 발행
      const { access_token, refresh_token } =
        await this.authJwtService.createTokens({
          id: user.id,
          login_id: user.login_id,
        });

      // user refresh token 저장

      return {
        ok: true,
        statusCode: 200,
        access_token,
        refresh_token,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async updateTokens(userId: number, ctx: Ctx): Promise<UpdateTokensOutput> {
    const user = await this.userService.findUserById(userId);

    const { access_token, refresh_token } =
      await this.authJwtService.createTokens({
        id: user.id,
        login_id: user.login_id,
      });

    ctx.res.cookie("x-token", access_token, cookieOptions);
    ctx.res.cookie("x-token-refresh", refresh_token, cookieOptions);

    return {
      ok: true,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
