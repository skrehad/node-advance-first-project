import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { HttpStatus } from 'http-status-ts';

const getAllStudentsFromDb = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const getSingleStudentsFromDb = (id: string) => {
  //  fineOne is custom query from services
  const result = Student.findOne({ id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentsFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      // custom generate university id
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      // custom generate university id
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
};
