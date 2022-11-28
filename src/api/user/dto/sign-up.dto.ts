import { User } from "../entity/user.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserInput {
  @ApiProperty()
  login_id: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  email: string;
}

export class CreateUserOutput extends CoreOutput {
  user?: User;
}
