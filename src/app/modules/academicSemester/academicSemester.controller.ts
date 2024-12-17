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
  const result = await AcademicSemesterServices.getAllAcademicSemesterIntoDB();
  sendResponse(res, {
    statusCode: HttpStatus.HttpStatus.OK,
    success: true,
    message: 'All Academic semester is find  successfully',
    data: result,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  // semesterId ta holo route a jei mane a find korvo mane  '/:semesterId', amon aikhane ja divo akhane tai diye call korvo
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
