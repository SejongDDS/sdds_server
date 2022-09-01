import { Query, Resolver } from "@nestjs/graphql";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
