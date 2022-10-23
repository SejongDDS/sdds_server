import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "./entity/member.entity";
import { Repository } from "typeorm";
import { SignUpInput, SignUpOutput } from "./dto/sign-up.dto";
import { WebsiteService } from "../website/website.service";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { GetMemberOutput, GetMembersOutput } from "./dto/get-member";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly websiteService: WebsiteService
  ) {}

  private readonly logger = new Logger(MemberService.name);

  async getMyMembers(
    websiteUrl: string,
    userId: number
  ): Promise<GetMembersOutput> {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      if (!website) {
        return {
          ok: false,
          error: new NotFoundException(),
          statusCode: 202,
        };
      }

      if (userId !== website.owner_id) {
        return {
          ok: false,
          error: new UnauthorizedException(),
          statusCode: 401,
        };
      }

      return {
        ok: true,
        statusCode: 200,
        members: website.members,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getMember(
    userId: number,
    websiteUrl: string,
    memberId: number
  ): Promise<GetMemberOutput> {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      if (!website) {
        return {
          ok: false,
          error: new NotFoundException(),
          statusCode: 202,
        };
      }

      if (userId !== website.owner_id) {
        return {
          ok: false,
          error: new UnauthorizedException(),
          statusCode: 401,
        };
      }

      const member = website.members.find((member) => member.id === +memberId);
      if (!member) {
        return {
          ok: false,
          error: new NotFoundException(),
          statusCode: 404,
        };
      }

      return {
        ok: true,
        statusCode: 200,
        member: member,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async signUp(input: SignUpInput, websiteUrl: string): Promise<SignUpOutput> {
    try {
      const website = await this.websiteService.findWebsiteByUrl(websiteUrl);
      if (!website) {
        return {
          ok: false,
          statusCode: 404,
          error: new NotFoundException(),
        };
      }

      const existMember = await this.memberRepository.findOne({
        where: {
          login_id: input.login_id,
        },
      });

      if (existMember) {
        return {
          ok: false,
          statusCode: 202,
          error: "This login_id already exist",
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
      return {
        ok: true,
        statusCode: 201,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async login(websiteUrl: string, input: LoginInput): Promise<LoginOutput> {
    try {
      const websiteFounded = await this.websiteService.findWebsiteByUrl(
        websiteUrl
      );
      const member = await this.memberRepository.findOne({
        where: {
          login_id: input.login_id,
          website: {
            id: websiteFounded.id,
          },
        },
        relations: ["website"],
        select: ["login_id", "password", "id"],
      });

      if (!member) {
        return {
          ok: false,
          statusCode: 404,
          error: new NotFoundException(),
        };
      }

      if (member && (await bcrypt.compare(input.password, member.password))) {
        return {
          ok: true,
          statusCode: 200,
        };
      }

      return {
        ok: false,
        statusCode: 202,
        error: "Not Match Password",
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
