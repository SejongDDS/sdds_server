import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UserResolver } from "./user.resolver";
import { UserController } from "./user.controller";
import { OrdersEntity } from "../orders/entity/orders.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, OrdersEntity])],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
