import { Request, Response } from 'express';
import { UserServices } from './user.service';
import { z } from 'zod';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;

    // Validate the data
    //   const zodParseData = studentValidationSchema.parse(studentData);

    // Save the data to the database
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

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

export const UserControllers = {
  createStudent,
};
