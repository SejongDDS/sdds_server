import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import { CreateUserInput, CreateUserOutput } from "./dto/sign-up.dto";
import { GetAllUserOutput } from "./dto/get-all-user.dto";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateUserOutput, {
    description: "아이디, 전화번호, 이메일 중복값 있으면 실패",
  })
  async signUp(
    @Args("createUserInput") createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.userService.signUp(createUserInput);
  }

  @Query((returns) => User)
  async getAllUser(): Promise<GetAllUserOutput> {
    return await this.userService.getAllUsers();
  }
}
