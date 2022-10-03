import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsString } from "class-validator";

export class CreateProductInput {
  @ApiProperty({ description: "상품 이름" })
  @IsString({ message: "should be string" })
  name: string;

  @ApiProperty({
    type: "string",
    description: "상품 가격 / 서버에서 Type 변환",
  })
  @IsString({ message: "should be string" })
  price: number;

  @ApiProperty({
    type: "string",
    description: "상품 갯수 / 서버에서 Type 변환",
    default: "1",
  })
  @IsString({ message: "should be number" })
  count: number;

  @ApiProperty({ description: "웹 사이트 URL" })
  @IsString({ message: "should be string" })
  website_url: string;

  @ApiProperty({ description: "카테고리 이름" })
  @IsString({ message: "should be string only char" })
  category_name: string;
}

export class UploadFiles {
  @ApiProperty({ description: "메인 상품 이미지" })
  main_image: Express.Multer.File[];

  @ApiProperty({ description: "썸네일 이미지" })
  thumbnail_image?: Express.Multer.File[];
}

export class UploadImageToS3Output {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}
