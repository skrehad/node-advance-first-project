import { Student } from './student.model';

const getAllStudentsFromDb = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([
    {
      $match: { id: id },
    },
  ]);

  return result;
};
// const deleteStudentsFromDb = async (id: string) => {
//   const result = await Student.updateOne({ id }, { isDeleted: true });
//   return result;
// };
export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
};
