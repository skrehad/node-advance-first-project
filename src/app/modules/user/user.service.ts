import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.ultis';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //   create a user object
  const userData: Partial<TUser> = {};

  //    if password is not provided,then create a default password
  userData.password = password || (config.default_password as string);

  //   set student role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  const session = await mongoose.startSession();

  try {
    //   manually create id
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction)
    const newUser = await User.create(userData);

    //   create a student
    if (Object.keys(newUser).length) {
      // set id, _id as User
      studentData.id = newUser.id;
      studentData.user = newUser._id; // reference id

      const newStudent = await Student.create(studentData);
      return newStudent;
    }
  } catch (error) {}
};

export const UserServices = {
  createStudentIntoDB,
};
