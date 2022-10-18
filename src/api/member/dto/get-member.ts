import { CoreOutput } from "../../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";
import { MemberEntity } from "../entity/member.entity";

export class GetMembersOutput extends CoreOutput {
  @ApiProperty()
  members?: MemberEntity[];
}

export class GetMemberOutput extends CoreOutput {
  @ApiProperty()
  member?: MemberEntity;
}
