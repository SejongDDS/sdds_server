import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "./entity/member.entity";
import { Repository } from "typeorm";
import { SignUpInput, SignUpOutput } from "./dto/sign-up.dto";
import { WebsiteService } from "../website/website.service";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly websiteService: WebsiteService
  ) {}

  private readonly logger = new Logger(MemberService.name);

  async signUp(input: SignUpInput, websiteUrl: string): Promise<SignUpOutput> {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      if (!website) {
        return {
          ok: false,
          error: new NotFoundException(),
        };
      }

      const member = this.memberRepository.create({
        login_id: input.login_id,
        password: input.password,
        email: input.email,
        phone: input.phone,
        birth: input.birth,
        website: website,
      });

      website.members.push(member);
      await this.websiteService.updateWebsiteEntity(website);
      await this.memberRepository.save(member);
      return {
        ok: true,
      };
    } catch (e) {}
  }
}
