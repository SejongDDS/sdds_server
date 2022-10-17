import { applyDecorators } from "@nestjs/common";
import { ApiParam, ApiQuery } from "@nestjs/swagger";

export function DocumentPagination() {
  return applyDecorators(
    ApiParam({
      name: "website_url",
      type: "string",
      description: "해당 웹사이트 URL",
    }),
    ApiQuery({
      name: "order",
      required: false,
      description: `"ASC" | "DESC" | "asc" | "desc", default: "DESC"`,
      type: "string",
    }),
    ApiQuery({
      name: "skip",
      type: "number",
      required: false,
      description:
        "skip is offset from where entities should be taken // default : 0",
    }),
    ApiQuery({
      name: "take",
      type: "number",
      required: false,
      description: "skip is limit // default : 15",
    })
  );
}
