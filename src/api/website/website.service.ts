import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";
import { Repository } from "typeorm";
import {
  CreateWebsiteInput,
  CreateWebsiteOutput,
  UploadWebsiteFiles,
} from "./website.interface";
import { UserService } from "../user/user.service";
import { getS3Instance } from "../../modules/s3";

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(WebsiteEntity)
    private readonly websiteRepository: Repository<WebsiteEntity>,
    private readonly userService: UserService
  ) {}
  private readonly logger = new Logger(WebsiteService.name);

  // todo : 웹사이트 파일 추가
  async createWebsite(
    userId: number,
    files: UploadWebsiteFiles,
    input: CreateWebsiteInput
  ): Promise<CreateWebsiteOutput> {
    try {
      const user = await this.userService.findUserById(userId);
      const website = this.websiteRepository.create({
        website_url: input.website_url,
      });
      website.owner = user;
      website.products = [];
      website.orders = [];
      website.members = [];
      await this.uploadWebsiteFiles(files, input.website_url);
      const newWebsite = await this.websiteRepository.save(website);
      this.logger.verbose(`create New Website ${JSON.stringify(newWebsite)}`);
      return {
        ok: true,
      };
    } catch (err) {
      this.logger.error(err);
      return {
        ok: false,
        error: err,
      };
    }
  }

  async getMyWebsites(userId: number) {
    const website = await this.websiteRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },

      relations: ["owner", "products", "orders", "members"],
    });

    if (website.length === 0) {
      return {
        ok: false,
        error: new NotFoundException(),
      };
    }

    return website;
  }

  async isDuplicateOfWebsite(websiteUrl: string) {
    try {
      const website = this.findWebsiteByUrl(websiteUrl);
      if (website) {
        return true;
      }

      return false;
    } catch (e) {
      this.logger.error(e);
      return {
        ok: false,
        error: new InternalServerErrorException(),
      };
    }
  }

  async findWebsiteByUrl(url: string): Promise<WebsiteEntity> {
    if (!url) {
      return undefined;
    }
    const website = await this.websiteRepository.findOneOrFail({
      where: {
        website_url: url,
      },
      relations: ["owner", "products", "orders", "members"],
    });

    return website;
  }

  async updateWebsiteEntity(website: WebsiteEntity) {
    return await this.websiteRepository.save(website);
  }

  async uploadWebsiteFiles(files: UploadWebsiteFiles, websiteUrl: string) {
    const s3 = getS3Instance();
    const { html, css } = files;
    html.map(async (file) => {
      const payload = {
        Bucket: `sdds/${websiteUrl}`,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.upload(payload, (err, data) => {
        if (err) {
          throw err;
        }
      });
    });
    css.map(async (file) => {
      const payload = {
        Bucket: `sdds/${websiteUrl}/css`,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.upload(payload, (err, data) => {
        if (err) {
          throw err;
        }
      });
    });
  }
}
