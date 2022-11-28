import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";

export class LoginInput {
  @ApiProperty()
  login_id: string;

  @ApiProperty()
  password: string;
}

export class LoginOutput extends CoreOutput {
  @ApiProperty()
  access_token?: string;

  @ApiProperty()
  refresh_token?: string;
}

export class LoginOutput2 extends CoreOutput {
  @ApiProperty()
  access_token?: string;

  @ApiProperty()
  refresh_token?: string;
}
