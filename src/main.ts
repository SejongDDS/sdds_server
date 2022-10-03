import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import * as express from "express";
import path from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
    exclude: [
      { path: "static", method: RequestMethod.GET },
      { path: "doc", method: RequestMethod.GET },
    ],
  });
  const config = new DocumentBuilder()
    .setTitle("SDDS API")
    .setDescription("SDDS API 문서")
    .setVersion("1.0")
    .addTag("SDDS")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);
  await app.listen(3000);
}
bootstrap();
