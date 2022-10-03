import { Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteResolver } from "./website.resolver";
import { WebsiteController } from "./website.controller";

@Module({
  controllers: [WebsiteController],
  providers: [WebsiteService, WebsiteResolver],
})
export class WebsiteModule {}
