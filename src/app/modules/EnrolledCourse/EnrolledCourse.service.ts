const HttpStatus = require('http-status-ts');
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TEnrolledCourse } from './EnrolledCourse.interface';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import EnrolledCourse from './EnrolledCourse.model';
import { Student } from '../student/student.model';
import { Course } from '../course/course.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1: Check if the offered courses is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max credits exceed
   * Step4: Create an enrolled course
   */

  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'Offered course not found !',
    );
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(HttpStatus.HttpStatus.BAD_GATEWAY, 'Room is full !');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(HttpStatus.HttpStatus.NOT_FOUND, 'Student not found !');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      HttpStatus.HttpStatus.CONFLICT,
      'Student is already enrolled !',
    );
  }

  // check total credits exceeds maxCredit
  //   const course = await Course.findById(isOfferedCourseExists.course);
  //   const currentCredit = course?.credits;

  //   const semesterRegistration = await SemesterRegistration.findById(
  //     isOfferedCourseExists.semesterRegistration,
  //   ).select('maxCredit');

  //   const maxCredit = semesterRegistration?.maxCredit;

  //   const enrolledCourses = await EnrolledCourse.aggregate([
  //     {
  //       $match: {
  //         semesterRegistration: isOfferedCourseExists.semesterRegistration,
  //         student: student._id,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'courses',
  //         localField: 'course',
  //         foreignField: '_id',
  //         as: 'enrolledCourseData',
  //       },
  //     },
  //     {
  //       $unwind: '$enrolledCourseData',
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         totalEnrolledCredits: 1,
  //       },
  //     },
  //   ]);

  //   //  total enrolled credits + new enrolled course credit > maxCredit
  //   const totalCredits =
  //     enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  //   if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
  //     throw new AppError(
  //       HttpStatus.HttpStatus.BAD_REQUEST,
  //       'You have exceeded maximum number of credits !',
  //     );
  //   }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Failed to enroll in this course !',
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
