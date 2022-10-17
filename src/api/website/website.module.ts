import { Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebsiteEntity } from "./entity/website.entity";
import { UserModule } from "../user/user.module";
import { OrdersEntity } from "../orders/entity/orders.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([WebsiteEntity, OrdersEntity]),
    UserModule,
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
