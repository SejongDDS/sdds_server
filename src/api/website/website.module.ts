import { Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteResolver } from "./website.resolver";
import { WebsiteController } from "./website.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WebsiteEntity])],
  controllers: [WebsiteController],
  providers: [WebsiteService, WebsiteResolver],
  exports: [WebsiteService],
})
export class WebsiteModule {}
