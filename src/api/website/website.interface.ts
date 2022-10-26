import { CoreOutput } from "../../common/dto/out-put.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWebsiteInput {
  @ApiProperty({
    type: "string",
    description: "사용자 웹사이트 URL",
    required: true,
  })
  website_url: string;
}

export class CreateWebsiteOutput extends CoreOutput {}

export class UploadWebsiteFiles {
  @ApiProperty({ description: "html file" })
  html: Express.Multer.File[];

  @ApiProperty({ description: "css file" })
  css: Express.Multer.File[];
}
