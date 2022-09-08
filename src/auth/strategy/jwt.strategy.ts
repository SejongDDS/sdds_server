import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "ACCESS_SECRET_KEY",
    });
  }

  async validate(payload: any) {
    return {
      user_id: payload.user_id,
      user_login_id: payload.user_login_id,
    };
  }
}
