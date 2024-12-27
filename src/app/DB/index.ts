import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'rehadhasan@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isSuperAdminExists = await User.findOne({
      role: USER_ROLE.superAdmin,
    });

    if (!isSuperAdminExists) {
      // Create super admin if not exists
      await User.create(superUser);
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};

export default seedSuperAdmin;
