import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";
import { Repository } from "typeorm";
import { CreateWebsiteInput, CreateWebsiteOutput } from "./website.interface";
import { UserService } from "../user/user.service";

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
      website.orders = [];

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

      relations: ["owner", "products", "orders"],
    });

    if (website.length === 0) {
      return {
        ok: false,
        error: new NotFoundException(),
      };
    }

    return website;
  }

  async findWebsiteByUrl(url: string): Promise<WebsiteEntity> {
    const website = await this.websiteRepository.findOne({
      where: {
        website_url: url,
      },
      relations: ["owner", "products", "orders"],
    });

    return website;
  }

  async updateWebsiteEntity(website: WebsiteEntity) {
    console.log(website);
    return await this.websiteRepository.save(website);
  }
}
