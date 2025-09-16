"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModel = void 0;
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    title: String,
    originalFileName: String,
    fileSize: Number,
    mimeType: String,
    url: String,
    order: Number
}, { timestamps: true });
exports.ImageModel = (0, mongoose_1.model)("Image", imageSchema);
