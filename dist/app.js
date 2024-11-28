"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const student_route_1 = require("./app/modules/student/student.route");
const user_route_1 = require("./app/modules/user/user.route");
const globalErrowhandler_1 = __importDefault(require("./app/middlewares/globalErrowhandler"));
const app = (0, express_1.default)();
// const port = 3000;
// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// application route
app.use('/api/v1/students', student_route_1.StudentRoutes);
app.use('/api/v1/users', user_route_1.UserRoutes);
app.get('/', (req, res) => { });
app.use(globalErrowhandler_1.default);
exports.default = app;
