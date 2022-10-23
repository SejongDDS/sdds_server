import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import * as Joi from "joi";
import { JwtService } from "@nestjs/jwt";
import { ProductEntity } from "./api/product/entity/product.entity";
import { ProductImageEntity } from "./api/product/entity/image.entity";
import { CategoryEntity } from "./api/product/entity/category.entity";
import { ProductModule } from "./api/product/product.module";
import { WebsiteModule } from "./api/website/website.module";
import { WebsiteEntity } from "./api/website/entity/website.entity";
import { AuthModule } from "./api/auth/auth.module";
import { User } from "./api/user/entity/user.entity";
import { UserDeploy } from "./api/user/entity/user_deploy.entity";
import { UserModule } from "./api/user/user.module";
import { OrdersModule } from "./api/orders/orders.module";
import { OrdersEntity } from "./api/orders/entity/orders.entity";
import { MemberEntity } from "./api/member/entity/member.entity";
import { MemberModule } from "./api/member/member.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === "dev" ? ".development.env" : ".test.env",
      ignoreEnvFile: process.env.NODE_ENV === "prod" ?? false,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod").required(),
        DATABASE_HOST: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      synchronize: true,
      entities: [
        User,
        UserDeploy,
        ProductEntity,
        ProductImageEntity,
        CategoryEntity,
        WebsiteEntity,
        OrdersEntity,
        MemberEntity,
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [UserModule, AuthModule],
      cors: {
        credentials: "include",
        origin: "http://localhost",
      },
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    UserModule,
    AuthModule,
    ProductModule,
    WebsiteModule,
    OrdersModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
