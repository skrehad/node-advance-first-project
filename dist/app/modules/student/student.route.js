"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("./student.controller");
const router = express_1.default.Router();
// for get all student
router.get('/', student_controller_1.StudentController.getAllStudents);
// for get one student data
router.get('/:studentId', student_controller_1.StudentController.getSingleStudent);
// for delete one student data
router.delete('/:studentId', student_controller_1.StudentController.deleteStudent);
exports.StudentRoutes = router;
