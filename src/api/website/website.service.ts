import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";
import { Repository } from "typeorm";

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(WebsiteEntity)
    private readonly websiteRepository: Repository<WebsiteEntity>
  ) {}

  async findWebsiteByUrl(url: string): Promise<WebsiteEntity> {
    const website = this.websiteRepository.findOne({
      where: {
        website_url: url,
      },
    });

    if (!website) {
      return null;
    }

    return website;
  }
}
