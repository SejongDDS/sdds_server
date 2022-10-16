import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";

@Controller("/user")
@ApiTags("유저 API")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUser(@Req() req) {
    return await this.userService.getUser(req.user.id);
  }
}
