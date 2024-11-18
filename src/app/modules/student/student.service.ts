import { TStudent } from './student.interface';
import { Student } from './student.model';
const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(studentData); // built in method

  const student = new Student(studentData);
  if (await student.isUserExists(studentData.id)) {
    throw new Error('User Already exists');
  }
  const result = await student.save(); // built in instance method

  return result;
};
const getAllStudentsFromDb = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};
export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
};
