import express from 'express';
import { StudentController } from './student.controller';

const router = express.Router();

// for get all student
router.get('/', StudentController.getAllStudents);
// for get one student data
router.get('/:studentId', StudentController.getSingleStudent);
// for delete one student data
// router.delete('/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
