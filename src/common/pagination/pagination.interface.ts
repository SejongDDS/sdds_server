export interface IPagination {
  order: "ASC" | "DESC" | "asc" | "desc";
  skip: number | undefined;
  take: number | undefined;
}
