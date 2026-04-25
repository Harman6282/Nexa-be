"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const asyncHandler_1 = require("../utils/asyncHandler");
const authenticate_1 = require("../middlewares/auth/authenticate");
const authRoutes = (0, express_1.Router)();
authRoutes.get("/health", (req, res) => {
    res.status(200).json({ message: "Health check pass" });
});
authRoutes.post("/signup", (0, asyncHandler_1.asyncHandler)(auth_controller_1.signup));
authRoutes.post("/verify-email", (0, asyncHandler_1.asyncHandler)(auth_controller_1.verifyToken));
authRoutes.post("/login", (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
authRoutes.post("/logout", [authenticate_1.authenticate], (0, asyncHandler_1.asyncHandler)(auth_controller_1.logout));
authRoutes.get("/me", [authenticate_1.authenticate], (0, asyncHandler_1.asyncHandler)(auth_controller_1.me));
exports.default = authRoutes;
