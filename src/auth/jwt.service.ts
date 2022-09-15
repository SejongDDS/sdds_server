import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateTokenInput, CreateTokensOutput } from "./dto/create-tokens.dto";

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async createTokens(input: CreateTokenInput): Promise<CreateTokensOutput> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user_id: input.id,
          user_login_id: input.login_id,
        },
        {
          secret: "ACCESS_SECRET_KEY",
          expiresIn: "1d",
        }
      ),
      this.jwtService.signAsync(
        {
          user_id: input.id,
          user_login_id: input.login_id,
        },
        {
          secret: "REFRESH_SECRET_KEY",
          expiresIn: "30d",
        }
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
