import { TStudent } from './student.interface';
import { Student } from './student.model';
const createStudentIntoDB = async (studentData: TStudent) => {
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already exists');
  }

  const result = await Student.create(studentData); // built in method

  // const student = new Student(studentData);
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User Already exists');
  // }
  // const result = await student.save(); // built in instance method

  return result;
};
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
  createStudentIntoDB,
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  // deleteStudentsFromDb,
};
