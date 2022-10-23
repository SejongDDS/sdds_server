import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entity/user.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class CreateUserInput {
  @Field((type) => String)
  @ApiProperty()
  login_id: string;

  @Field((type) => String)
  @ApiProperty()
  password: string;

  @Field((type) => String)
  @ApiProperty()
  phone_number: string;

  @Field((type) => String)
  @ApiProperty()
  email: string;
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => User)
  user?: User;
}
