import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberEntity } from "./entity/member.entity";
import { WebsiteModule } from "../website/website.module";

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity]), WebsiteModule],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
