import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { HttpStatus } from 'http-status-ts';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDb = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};
const getSingleStudentsFromDb = (id: string) => {
  //  fineOne is custom query from services
  const result = Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  //  name, guardian, localGuardian agula muluto jeisob object ar modde aro data ase ...remainingStudentData mane baki data gula
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*

  // kiso na korle normally amne jay but amne gele  oi object ar sob kiso coila jaiya sodo ai data e thakvo
   
  guardian: {
      fatherOccupation:"Teacher"
    }


  // ai rokom kore pataite parle sodo jeita patamu oitai update hoivo baki gula thakvo
    guardian.fatherOccupation = Teacher

    name.firstName = 'A'
    name.lastName = 'Red'
  */

  // agula hoitase data( guardian.fatherOccupation = Teacher) abave patanur jonno
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentsFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      // custom generate university id
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const userId = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
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
    throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete Student');
  }
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  updateStudentIntoDB,
  deleteStudentsFromDb,
};
