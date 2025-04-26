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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const src_1 = require("../../prisma/src");
const notificationRouter = (0, express_1.Router)();
// GET /api/v1/notifications
notificationRouter.get("/", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId; // you must have userId from your middleware
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const notifications = yield src_1.prisma.notifications.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({ notifications });
    }
    catch (error) {
        console.error("Failed to fetch notifications:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}));
exports.default = notificationRouter;
