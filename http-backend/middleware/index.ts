import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";
config();

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const middleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
