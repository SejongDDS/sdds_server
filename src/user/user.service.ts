import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserInput, CreateUserOutput } from "./dto/sign-up.dto";
import { GetAllUserOutput } from "./dto/get-all-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  logger = new Logger(UserService.name);

  async signUp(createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: [
          { login_id: createUserInput.login_id },
          { email: createUserInput.email },
          { phone_number: createUserInput.phone_number },
        ],
      });
      if (user) {
        return {
          ok: false,
          error: "Already Exists User",
        };
      }
      const newUser = this.userRepository.create(createUserInput);
      await this.userRepository.save(newUser);
      return {
        ok: true,
        user: newUser,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  async getAllUsers(): Promise<GetAllUserOutput> {
    const users = await this.userRepository.find();
    return {
      ok: true,
      users,
    };
  }

  async getUser(userId: number) {
    const user = await this.findUserById(userId);
    return user;
  }

  async findUserById(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: {
          id: userId,
        },
        select: ["websites"],
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findUserForLogin(loginId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        login_id: loginId,
      },
      select: ["id", "login_id", "password"],
    });
  }
}
