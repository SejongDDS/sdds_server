import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";

export class JwtGuard extends AuthGuard("jwt") {}
