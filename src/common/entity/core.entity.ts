import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType({ isAbstract: true })
export class Core {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updated_at: Date;
}
