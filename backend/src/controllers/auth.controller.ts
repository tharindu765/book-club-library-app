import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { APIError } from "../errors/ApiError";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!req.body.role) {
        req.body.role = "staff";
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return next(new APIError(409, "Email already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file ? req.file.path : undefined;

    const user = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      role,
      photo,
    });

    await user.save();

    // ✅ Generate tokens
    const accessToken = createAccessToken(user.id.toString());
    const refreshToken = createRefreshToken(user.id.toString());

    // ✅ Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh-token",
    });

    // ✅ Return with accessToken and user
    res.status(201).json({
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new APIError(401, "Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new APIError(401, "Invalid email or password"));
    }

    const accessToken = createAccessToken(user.id.toString());
    const refreshToken = createRefreshToken(user.id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh-token",
    });

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new APIError(401, "Refresh token missing"));

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (err : Error | null, decoded : string | JwtPayload | undefined) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return next(new APIError(401, "Refresh token expired"));
        } else if (err instanceof JsonWebTokenError) {
          return next(new APIError(401, "Invalid refresh token"));
        } else {
          return next(new APIError(401, "Could not verify refresh token"));
        }
      }

      if (!decoded || typeof decoded === "string") {
        return next(new APIError(401, "Invalid token payload"));
      }

      const userId = (decoded as JwtPayload).userId;
      const user = await UserModel.findById(userId);

      if (!user) return next(new APIError(401, "User not found"));

      const newAccessToken = createAccessToken(userId);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      expires: new Date(0),
      path: "/api/auth/refresh-token",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
