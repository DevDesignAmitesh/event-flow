"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("../routes/auth"));
const events_1 = __importDefault(require("../routes/events"));
const user_1 = __importDefault(require("../routes/user"));
const audit_1 = __importDefault(require("../routes/audit"));
const notify_1 = __importDefault(require("../routes/notify"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/event", events_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/audit", audit_1.default);
app.use("/api/v1/notifications", notify_1.default);
app.listen(PORT, () => {
    console.log("server is running on", PORT);
});
