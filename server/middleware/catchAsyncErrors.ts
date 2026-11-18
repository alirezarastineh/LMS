import { NextFunction, Request, Response } from "express";

export const CatchAsyncError =
  <TFirst = Request>(
    theFunc: (arg: TFirst, res: Response, next: NextFunction) => unknown
  ) =>
  (arg: TFirst, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(arg, res, next)).catch(next);
  };
