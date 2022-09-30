import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import {WebsiteResolver} from "./website.resolver";

@Module({
  controllers: [],
  providers: [WebsiteService, WebsiteResolver]
})
export class WebsiteModule {}
