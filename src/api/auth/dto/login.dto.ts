import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class LoginInput {
  @Field((type) => String)
  @ApiProperty()
  login_id: string;

  @Field((type) => String)
  @ApiProperty()
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String)
  @ApiProperty()
  access_token?: string;

  @Field((type) => String)
  @ApiProperty()
  refresh_token?: string;
}

export class LoginOutput2 extends CoreOutput {
  @ApiProperty()
  access_token?: string;

  @ApiProperty()
  refresh_token?: string;
}
