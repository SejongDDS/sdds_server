import { Field, ObjectType, PartialType } from "@nestjs/graphql";
import { User } from "../entity/user.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";

@ObjectType()
export class GetAllUserOutput extends CoreOutput {
  @Field((type) => [User])
  users: User[];
}
