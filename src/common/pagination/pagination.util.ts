import { IPagination } from "./pagination.interface";
import { DEFAULT_PAGINATION } from "./pagination.constant";

export const getDefaultQuery = ({ skip, take, order }) => {
  return {
    order: order ?? DEFAULT_PAGINATION.ORDER,
    take: take ? +take : DEFAULT_PAGINATION.TAKE,
    skip: skip ? +skip : DEFAULT_PAGINATION.SKIP,
  };
};
