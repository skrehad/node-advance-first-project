import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.ultis';
import AppError from '../../errors/AppError';
import { HttpStatus } from 'http-status-ts';

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
    session.startTransaction();

    //   manually create id
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction)
    const newUser = await User.create([userData], { session });

    //   create a student
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create User');
    }
    // set id, _id as User
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id; // reference id

    const newStudent = await Student.create([studentData], { session });
    // create a user (transaction2)
    if (!newStudent.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create Student');
  }
};

export const UserServices = {
  createStudentIntoDB,
};
