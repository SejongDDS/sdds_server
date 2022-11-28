import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "./entity/image.entity";
import { Repository } from "typeorm";
import { UploadFiles, UploadImageToS3Output } from "./product.interface";
import { getS3Instance } from "../../modules/s3";
import { rejects } from "assert";

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly imageRepository: Repository<ProductImageEntity>
  ) {}

  private readonly logger = new Logger(ProductImageService.name);

  // todo : aws 이미지 업로드
  async createImage(
    files: UploadFiles,
    websiteUrl: string,
    productName: string
  ) {
    try {
      const { main_url, thumbnail_url } = await this.uploadImageAndGetUrl(
        files,
        websiteUrl,
        productName
      );
      const newImage = this.imageRepository.create({
        main_url,
        thumbnail_url,
        start: 0,
        end: files.main_image.length - 1,
      });
      return await this.imageRepository.save(newImage);
    } catch (e) {
      this.logger.error("createImage : ", e);
    }
  }

  // todo : 이미지 업로드 수정
  async uploadImageAndGetUrl(
    files: UploadFiles,
    websiteUrl: string,
    productName: string
  ) {
    const s3 = getS3Instance();
    const mainImageUrl = `https://s3.ap-northeast-2.amazonaws.com/${process.env.BUCKET_NAME}/${websiteUrl}/products/${productName}/main_image`;
    const thumbnailImageUrl = `https://s3.ap-northeast-2.amazonaws.com/${process.env.BUCKET_NAME}/${websiteUrl}/products/${productName}/thumbnail_image`;
    files.main_image.map(async (image, index) => {
      const payload = {
        Bucket: `${process.env.BUCKET_NAME}/${websiteUrl}/products/${productName}/main_image`,
        Key: `${index}.png`,
        Body: image.buffer,
      };
      await s3.upload(payload, (err, data: UploadImageToS3Output) => {
        if (err) {
          this.logger.error("error of uploading thumbnail_image : ", err);
          throw err;
        }
      });
    });

    files.thumbnail_image.map(async (image, index) => {
      const payload = {
        Bucket: `${process.env.BUCKET_NAME}/${websiteUrl}/products/${productName}/thumbnail_image`,
        Key: `${index}.png`,
        Body: image.buffer,
      };
      await s3.upload(payload, (err, data: UploadImageToS3Output) => {
        if (err) {
          this.logger.error("error of uploading thumbnail_image : ", err);
          throw err;
        }
      });
    });

    return {
      main_url: mainImageUrl,
      thumbnail_url: thumbnailImageUrl,
    };
  }

  async updateImageEntity(productImageEntity: ProductImageEntity) {
    return await this.imageRepository.save(productImageEntity);
  }
}
