import { StudentServices } from './student.service';
import { Request, Response } from 'express';
import { z } from 'zod';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;

    // Validate the data
    const zodParseData = studentValidationSchema.parse(studentData);

    // Save the data to the database
    const result = await StudentServices.createStudentIntoDB(zodParseData);

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error: any) {
    // Handle validation or other errors
    res.status(400).json({
      success: false,
      message: error.message || 'Validation Failed or Something went wrong',
      error: error instanceof z.ZodError ? error.errors : error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Validation Failed or Something went wrong',
      error: error instanceof z.ZodError ? error.errors : error,
    });
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentsFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Validation Failed or Something went wrong',
      error: error instanceof z.ZodError ? error.errors : error,
    });
  }
};

// const deleteStudent = async (req: Request, res: Response) => {
//   try {
//     const { studentId } = req.params;
//     const result = await StudentServices.deleteStudentsFromDb(studentId);
//     res.status(200).json({
//       success: true,
//       message: 'Students is deleted successfully',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || 'Validation Failed or Something went wrong',
//       error: error instanceof z.ZodError ? error.errors : error,
//     });
//   }
// };

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  // deleteStudent,
};
