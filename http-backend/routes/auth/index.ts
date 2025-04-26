import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/src";

const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// ---------------------- Signup ----------------------
authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role },
      });

      const token = generateToken(user.id, user.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: "Signup successful",
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ---------------------- Signin ----------------------
authRouter.post(
  "/signin",
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = generateToken(user.id, user.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Signin successful",
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ---------------------- Signout ----------------------
authRouter.post("/signout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signed out successfully" });
});

// ----------------------Checking is the user authenticated --------
authRouter.get("/isAuth", (req: Request, res: Response): any => {
  const token = req.cookies.token; // get the token from the cookies

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // verify it
    return res.status(200).json({
      isAuthenticated: true,
      message: "authenticated",
      username: (decoded as any).username,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Invalid token" });
  }
});

export default authRouter;
