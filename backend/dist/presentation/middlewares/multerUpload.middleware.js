"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleImageEditUpload = exports.imageUpload = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const commonErrorMsg_constants_1 = require("../../utils/constants/commonErrorMsg.constants");
const custom_error_1 = require("../../utils/errors/custom.error");
const httpResponseCode_utils_1 = require("../../utils/constants/httpResponseCode.utils");
const uploadDir = path_1.default.resolve("src/uploads");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        }
        else {
            cb(new custom_error_1.CustomError(commonErrorMsg_constants_1.ErrorMsg.ALLOWED_FILE_TYPE, httpResponseCode_utils_1.HttpResCode.BAD_REQUEST));
        }
    },
});
exports.imageUpload = exports.upload.fields([
    { name: "files", maxCount: 10 },
    { name: "titles" },
    { name: "originalFileNames" },
    { name: "mimeTypes" },
    { name: "fileSizes" },
]);
exports.singleImageEditUpload = exports.upload.fields([
    { name: "file", maxCount: 1 },
    { name: "title", maxCount: 1 },
    { name: "originalFileName", maxCount: 1 },
    { name: "mimeType", maxCount: 1 },
    { name: "fileSize", maxCount: 1 },
]);
