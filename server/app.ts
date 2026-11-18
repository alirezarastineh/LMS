import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleWare } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import rateLimit from "express-rate-limit";
import ErrorHandler from "./utils/ErrorHandler";

export const app = express();

app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

const trimTrailingSlash = (url: string): string =>
  url.endsWith("/") ? url.slice(0, -1) : url;

const allowedOrigins = new Set(
  [
    process.env.ORIGIN,
    process.env.ORIGIN_DEPLOYED,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => trimTrailingSlash(origin)),
);

const isLocalDevOrigin = (origin: string): boolean => {
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      protocol === "http:" &&
      (hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("10.") ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("172."))
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? trimTrailingSlash(origin) : undefined;
      if (
        !normalizedOrigin ||
        allowedOrigins.has(normalizedOrigin) ||
        (process.env.NODE_ENV !== "production" &&
          isLocalDevOrigin(normalizedOrigin))
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);

app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
);

app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});

app.use(limiter);

app.use(ErrorMiddleWare);
