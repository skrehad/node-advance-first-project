const HttpStatus = require('http-status-ts');
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';
import catchAsync from '../../utils/catchAsync';

// for get all student data
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDb(req.query);
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Student is created successfully',
    meta: result.meta,
    data: result.result,
  });
});

// for get single student data
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentsFromDb(id);
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Single student find successfully',
    data: result,
  });
});

// for updating student data
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Student is updated successfully',
    data: result,
  });
});

// for deleting student data
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentsFromDb(id);
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
