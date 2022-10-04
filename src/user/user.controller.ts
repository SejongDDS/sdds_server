import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { ApiTags } from "@nestjs/swagger";

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
