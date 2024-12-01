import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDb();
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    data: result,
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentsFromDb(studentId);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Single student find successfully',
    data: result,
  });
  // console.log(studentId);
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentsFromDb(studentId);
  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
