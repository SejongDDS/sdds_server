import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UnauthorizedException } from "@nestjs/common";

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string | UnauthorizedException;

  @Field((type) => Int, { nullable: true })
  statusCode?: number;

  @Field((type) => Boolean)
  ok: boolean;
}
