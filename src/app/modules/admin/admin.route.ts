import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controller';
import { updateAdminValidationSchema } from './admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.admin), AdminControllers.getAllAdmins);

router.get('/:id', auth(USER_ROLE.admin), AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', auth(USER_ROLE.admin), AdminControllers.deleteAdmin);

export const AdminRoutes = router;
