import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/',
  auth(USER_ROLE.admin),
  AcademicDepartmentControllers.getAllAcademicDepartments,
);

router.get(
  '/:departmentId',
  auth(USER_ROLE.admin),
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  auth(USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
