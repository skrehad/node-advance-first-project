import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
const HttpStatus = require('http-status-ts');
import catchAsync from '../../utils/catchAsync';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'All Offered Courses find successfully !',
    meta: result.meta,
    data: result.result,
  });
});

const getMyOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'My Offered Courses find successfully !',
    // meta: result.meta,
    data: result,
  });
});

const getSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    sendResponse(res, {
      statusCode: HttpStatus.HttpStatus.OK,
      success: true,
      message: 'OfferedCourse fetched successfully',
      data: result,
    });
  },
);

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'OfferedCourse deleted successfully',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getMyOfferedCourses,
  getSingleOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourse,
};
