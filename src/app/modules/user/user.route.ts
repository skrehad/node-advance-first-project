import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';

const router = express.Router();

// for validation by middleware

// for create student
router.post(
  '/create-student',
  validateRequest(studentValidations.studentValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
