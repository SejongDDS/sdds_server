import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import * as express from "express";
import path from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.static(path.join(__dirname + "public")));
  app.use("/static", express.static("public"));
  app.setGlobalPrefix("/api/v1", {
    exclude: [{ path: "static", method: RequestMethod.GET }],
  });
  // app.useStaticAssets;
  await app.listen(3000);
}
bootstrap();
