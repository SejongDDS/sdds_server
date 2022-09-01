import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entity/user.entity";
import { CoreOutput } from "../../common/dto/out-put.dto";

@InputType()
export class CreateUserInput extends PickType(User, [
  "login_id",
  "email",
  "password",
  "phone_number",
]) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
