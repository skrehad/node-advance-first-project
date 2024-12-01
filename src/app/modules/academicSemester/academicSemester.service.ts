import mongoose from 'mongoose';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterIntoDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};
// const getSingleAcademicSemesterIntoDB = async (id: string) => {
//   const result = await AcademicSemester.findById({ id });
//   return result;
// };

// _id aita holo backend a jei name a id thakve
const getSingleAcademicSemesterIntoDB = async (_id: string) => {
  const result = await AcademicSemester.findOne({
    _id: new mongoose.Types.ObjectId(_id),
  });
  return result;
};

// const updateSingleAcademicSemesterIntoDB = async (
//   semesterId: string,
//   academicData: TAcademicSemester,
// ) => {
//   const result = await AcademicSemester.findByIdAndUpdate(
//     semesterId,
//     academicData,
//     {
//       new: true,
//     },
//   );

//   return result;
// };

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterIntoDB,
  getSingleAcademicSemesterIntoDB,
  updateAcademicSemesterIntoDB,
};
