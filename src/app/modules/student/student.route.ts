import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

// for get all student
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getAllStudents,
);
// for get one student data
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getSingleStudent,
);
// for student update data
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateStudentValidationSchema),

  StudentController.updateStudent,
);
// for delete one student data
router.delete('/:id', auth(USER_ROLE.admin), StudentController.deleteStudent);

export const StudentRoutes = router;
