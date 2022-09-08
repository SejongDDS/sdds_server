import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { LoginOutput } from "./dto/login.dto";
import { AuthJwtService } from "./jwt.service";
import { ref } from "joi";
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
}
