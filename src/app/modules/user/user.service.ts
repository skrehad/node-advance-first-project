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

export const UserService = {
  createStudentIntoDB,
};
