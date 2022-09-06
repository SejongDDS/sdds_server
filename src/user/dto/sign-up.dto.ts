import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entity/user.entity";
import { CoreOutput } from "../../common/dto/out-put.dto";

@InputType()
export class CreateUserInput {
  @Field((type) => String)
  login_id: string;

  @Field((type) => String)
  password: string;

  @Field((type) => String)
  phone_number: string;

  @Field((type) => String)
  email: string;
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => User)
  user?: User;
}
