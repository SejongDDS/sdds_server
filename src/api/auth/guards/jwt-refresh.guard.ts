import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";

export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {}
