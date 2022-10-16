import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";
import { Repository } from "typeorm";
import { UserService } from "../../user/user.service";
import { CreateWebsiteInput, CreateWebsiteOutput } from "./website.interface";

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
    input: CreateWebsiteInput
  ): Promise<CreateWebsiteOutput> {
    try {
      const user = await this.userService.findUserById(userId);
      const website = this.websiteRepository.create({
        website_url: input.website_url,
      });
      website.owner = user;
      website.products = [];

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

  async findWebsiteByUrl(url: string): Promise<WebsiteEntity> {
    const website = await this.websiteRepository.findOne({
      where: {
        website_url: url,
      },
      relations: ["owner", "products"],
    });

    return website;
  }

  async updateWebsiteEntity(website: WebsiteEntity) {
    return await this.websiteRepository.save(website);
  }
}
