import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "./entity/image.entity";
import { Repository } from "typeorm";
import { UploadFiles, UploadImageToS3Output } from "./product.interface";
import { S3 } from "aws-sdk";

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly imageRepository: Repository<ProductImageEntity>
  ) {}

  private readonly logger = new Logger(ProductImageService.name);

  // todo : aws 이미지 업로드
  async createImage(files: UploadFiles, websiteUrl: string) {
    const imageUrl = await this.uploadImage(files, websiteUrl).then((res) => {
      return res;
    });
    const newImage = this.imageRepository.create({
      main_url: imageUrl,
    });
    return await this.imageRepository.save(newImage);
  }

  async uploadImage(files: UploadFiles, websiteUrl: string) {
    let url: string;
    const s3 = this.getS3();
    const mainImage = files.main_image[0].originalname;
    const payload = {
      Bucket: `sdds/${websiteUrl}`,
      Key: mainImage,
      Body: files.main_image[0].buffer,
    };

    return new Promise((resolve, reject) => {
      s3.upload(payload, (err, data: UploadImageToS3Output) => {
        if (err) {
          reject(err);
          throw err;
        }

        url = data.Location;
        resolve(url);
      });
    }).then((res) => {
      return url;
    });
  }

  async updateImageEntity(productImageEntity: ProductImageEntity) {
    return await this.imageRepository.save(productImageEntity);
  }

  getS3(): S3 {
    return new S3({
      credentials: {
        accessKeyId: `${process.env.ACCESS_ID}`,
        secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
      },
    });
  }
}
