import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dto/out-put.dto";

@InputType()
export class LoginInput {
  @Field((type) => String)
  login_id: string;

  @Field((type) => String)
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String)
  access_token?: string;
  @Field((type) => String)
  refresh_token?: string;
}
