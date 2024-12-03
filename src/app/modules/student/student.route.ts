import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();

// for get all student
router.get('/', StudentController.getAllStudents);
// for get one student data
router.get('/:studentId', StudentController.getSingleStudent);
// for student update data
router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),

  StudentController.updateStudent,
);
// for delete one student data
router.delete('/:studentId', StudentController.deleteStudent);

export const StudentRoutes = router;
