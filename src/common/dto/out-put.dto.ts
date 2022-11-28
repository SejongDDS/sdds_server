import { UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class CoreOutput {
  @ApiProperty()
  error?: string | UnauthorizedException;

  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  ok: boolean;
}
