import { StudentServices } from './student.service';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentsFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
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
  getAllStudents,
  getSingleStudent,
  // deleteStudent,
};
