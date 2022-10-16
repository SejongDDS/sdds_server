import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from "./auth.resolver";
import { AuthJwtService } from "./jwt.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    AuthResolver,
    AuthJwtService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
