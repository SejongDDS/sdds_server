import { PickType } from "@nestjs/swagger";
import { SignUpInput } from "./sign-up.dto";
import { CoreOutput } from "../../../common/dto/out-put.dto";

export class LoginInput extends PickType(SignUpInput, [
  "login_id",
  "password",
]) {}

export class LoginOutput extends CoreOutput {}
