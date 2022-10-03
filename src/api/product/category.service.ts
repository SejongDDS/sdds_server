import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}
  private readonly logger = new Logger(CategoryService.name);

  async findCategory(categoryName: string): Promise<CategoryEntity> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          name: categoryName,
        },
      });

      if (!category) {
        return await this.createCategory(categoryName);
      }

      return category;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async createCategory(categoryName: string): Promise<CategoryEntity> {
    try {
      const category = this.categoryRepository.create({
        name: categoryName,
      });
      return await this.categoryRepository.save(category);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
