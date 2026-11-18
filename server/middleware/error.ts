import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

interface IAppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
}

export const ErrorMiddleWare = (
  err: IAppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message === "" ? "Internal Server Error" : err.message;

  if (err.name === "CastError") {
    const castErr = new ErrorHandler(
      `Resource not found. Invalid: ${err.path}`,
      400
    );
    statusCode = castErr.statusCode;
    message = castErr.message;
  }

  if (err.code === 11_000) {
    const dupErr = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue ?? {}).join(", ")} entered`,
      400
    );
    statusCode = dupErr.statusCode;
    message = dupErr.message;
  }

  if (err.name === "JasonWebTokenError") {
    const jwtErr = new ErrorHandler("JWT is not valid, try again", 400);
    statusCode = jwtErr.statusCode;
    message = jwtErr.message;
  }

  if (err.name === "TokenExpiredError") {
    const expErr = new ErrorHandler("JWT is expired, try again", 400);
    statusCode = expErr.statusCode;
    message = expErr.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
