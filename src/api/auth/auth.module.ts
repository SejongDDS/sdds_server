import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { AuthJwtService } from "./jwt.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthJwtService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
