import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();

// for get all student
router.get('/', StudentController.getAllStudents);
// for get one student data
router.get('/:id', StudentController.getSingleStudent);
// for student update data
router.patch(
  '/:id',
  validateRequest(updateStudentValidationSchema),

  StudentController.updateStudent,
);
// for delete one student data
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
