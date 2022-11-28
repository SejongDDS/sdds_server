import { User } from "../entity/user.entity";
import { CoreOutput } from "../../../common/dto/out-put.dto";

export class GetAllUserOutput extends CoreOutput {
  users: User[];
}
