import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  @ApiProperty()
  error?: string | UnauthorizedException;

  @Field((type) => Int, { nullable: true })
  @ApiProperty()
  statusCode?: number;

  @Field((type) => Boolean)
  @ApiProperty()
  ok: boolean;
}
