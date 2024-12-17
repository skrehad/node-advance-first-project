import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.ultis';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Admin } from '../admin/admin.model';
const HttpStatus = require('http-status-ts');

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
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create User',
      );
    }
    // set id, _id as User
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id; // reference id

    const newStudent = await Student.create([studentData], { session });
    // create a user (transaction2)
    if (!newStudent.length) {
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create Student',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      HttpStatus.HttpStatus.BAD_REQUEST,
      'Failed to create Student',
    );
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();
  console.log(HttpStatus.HttpStatus.OK);

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create user',
      );
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create faculty',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set user role as admin
  userData.role = 'admin';

  const session = await mongoose.startSession();
  // console.log(HttpStatus.HttpStatus.OK);

  try {
    session.startTransaction();

    // generate user ID
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create user',
      );
    }

    // associate new user with admin
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    // create an admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(
        HttpStatus.HttpStatus.BAD_REQUEST,
        'Failed to create admin',
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    // Rollback transaction if any error occurs
    await session.abortTransaction();
    await session.endSession();

    // Throw specific AppError with error message
    throw new AppError(
      HttpStatus.HttpStatus.INTERNAL_SERVER_ERROR,
      err.message || 'Something went wrong',
    );
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
