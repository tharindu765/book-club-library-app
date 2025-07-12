import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { APIError } from "../errors/ApiError";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next(new APIError(401, "Access token missing"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return next(new APIError(401, "Access token expired"));
        } else if (err instanceof JsonWebTokenError) {
          return next(new APIError(401, "Invalid access token"));
        } else {
          return next(new APIError(401, "Could not authenticate token"));
        }
      }

      if (!decoded || typeof decoded === "string") {
        return next(new APIError(401, "Invalid token payload"));
      }

      // Optionally attach decoded user to req
      //(req as any).user = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};
