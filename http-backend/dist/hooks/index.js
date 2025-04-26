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
exports.notifyEventSubscription = notifyEventSubscription;
const ws_1 = __importDefault(require("ws"));
function notifyEventSubscription(userEmail, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = new ws_1.default(`ws://localhost:8080?email=${userEmail}`);
        socket.onopen = () => {
            const message = {
                type: "event-subscribe",
                email: userEmail,
                eventId,
            };
            socket.send(JSON.stringify(message));
        };
        socket.onmessage = (event) => {
            console.log("Server replied:", event.data);
            socket.close();
        };
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        socket.onclose = () => {
            console.log("WebSocket connection closed.");
        };
    });
}
