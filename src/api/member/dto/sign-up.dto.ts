import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { MemberEntity } from "../entity/member.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";

export class SignUpInput extends OmitType(MemberEntity, ["orders"]) {}

export class SignUpOutput extends CoreOutput {}
