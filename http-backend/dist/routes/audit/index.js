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
const auditRouter = (0, express_1.Router)();
// GET /audit - Fetch audit logs for the logged-in user
auditRouter.get("/", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // assuming your auth middleware adds user to req
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const auditLogs = yield src_1.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res.status(200).json({ auditLogs });
    }
    catch (error) {
        console.error("Error fetching audit logs:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = auditRouter;
