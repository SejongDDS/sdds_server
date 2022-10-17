import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersEntity } from "./entity/orders.entity";
import { WebsiteModule } from "../website/website.module";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity]),
    WebsiteModule,
    ProductModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
