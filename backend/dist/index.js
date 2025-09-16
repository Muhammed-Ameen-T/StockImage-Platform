"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const env_config_1 = require("./config/env.config");
const commonErrorMsg_constants_1 = require("./utils/constants/commonErrorMsg.constants");
const commonSuccessMsg_constants_1 = require("./utils/constants/commonSuccessMsg.constants");
const mongoose_1 = require("./infrastructure/database/mongoose");
const errorHandler_middleware_1 = __importDefault(require("./presentation/middlewares/errorHandler.middleware"));
const logger_middleware_1 = require("./presentation/middlewares/logger.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [env_config_1.env.CLIENT_ORIGIN, 'http://localhost:3000'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const userAuth_routes_1 = __importDefault(require("./presentation/routes/userAuth.routes"));
const imageMng_routes_1 = __importDefault(require("./presentation/routes/imageMng.routes"));
app.use('/api/auth', userAuth_routes_1.default);
app.use('/api/images', imageMng_routes_1.default);
app.use(logger_middleware_1.requestLogger);
app.use(errorHandler_middleware_1.default);
const PORT = env_config_1.env.PORT;
const startServer = async () => {
    try {
        await (0, mongoose_1.connectDB)();
        const server = (0, http_1.createServer)(app);
        server.listen(PORT, () => {
            console.log(`${commonSuccessMsg_constants_1.SuccessMsg.SERVER_RUNNING} ${PORT} 🚀`);
        });
    }
    catch (error) {
        console.error(commonErrorMsg_constants_1.ErrorMsg.FAILED_START_SERVER, error);
        process.exit(1);
    }
};
startServer();
