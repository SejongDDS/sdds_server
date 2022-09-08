import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "REFRESH_SECRET_KEY",
    });
  }

  async validate(payload: any) {
    return {
      user_id: payload.user_id,
      user_login_id: payload.user_login_id,
    };
  }
}
