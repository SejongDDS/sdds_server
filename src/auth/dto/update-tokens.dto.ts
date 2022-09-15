import { CoreOutput } from "../../common/dto/out-put.dto";

export class UpdateTokensOutput extends CoreOutput {
  accessToken?: string;
  refreshToken?: string;
}
