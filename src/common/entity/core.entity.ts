import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@ObjectType({ isAbstract: true })
export class Core {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  @ApiProperty()
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  @ApiProperty()
  updated_at: Date;
}
