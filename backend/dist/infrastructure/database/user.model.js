"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    password: String,
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
