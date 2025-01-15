const HttpStatus = require('http-status-ts');
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterIntoDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'All Academic semester is find  successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  // if i send semesterId in the backend then router should call( /:semesterId ) like it
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterIntoDB(semesterId);
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'Single Academic semester is find  successfully',
    data: result,
  });
});
const updateSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const academicData = req.body;
  // console.log(carId);

  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    academicData,
  );
  res.status(200).json({
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
