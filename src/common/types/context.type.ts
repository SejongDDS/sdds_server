import { Request, Response } from "express";

type Ctx = {
  req: Request;
  res: Response;
};

export default Ctx;
