"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const src_1 = require("../../prisma/src");
const authRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const generateToken = (userId, role, email) => {
    return jsonwebtoken_1.default.sign({ userId, role, email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
// ---------------------- Signup ----------------------
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = yield src_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield src_1.prisma.user.create({
            data: { email, password: hashedPassword, role },
        });
        const token = generateToken(user.id, user.role, user.email);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({
            message: "Signup successful",
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
// ---------------------- Signin ----------------------
authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Missing credentials" });
    try {
        const user = yield src_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = generateToken(user.id, user.role, user.email);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Signin successful",
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
// ---------------------- Signout ----------------------
authRouter.post("/signout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Signed out successfully" });
});
// ----------------------Checking is the user authenticated --------
authRouter.get("/isAuth", (req, res) => {
    const token = req.cookies.token; // get the token from the cookies
    if (!token) {
        return res
            .status(401)
            .json({ isAuthenticated: false, message: "Not authenticated" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // verify it
        return res.status(200).json({
            isAuthenticated: true,
            message: "authenticated",
            data: decoded,
        });
    }
    catch (error) {
        return res
            .status(401)
            .json({ isAuthenticated: false, message: "Invalid token" });
    }
});
exports.default = authRouter;
