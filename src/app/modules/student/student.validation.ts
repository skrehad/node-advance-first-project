import { z } from 'zod';

// Define the UserName schema
const userNameValidationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  middleName: z.string().trim().optional(),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .regex(/^[a-zA-Z]+$/, 'Last name must contain only alphabetic characters'),
});

// Define the Guardian schema
const guardianValidationSchema = z.object({
  fatherName: z.string().trim().min(1, "Father's name is required"),
  fatherOccupation: z.string().trim().min(1, "Father's occupation is required"),
  fatherContactNo: z
    .string()
    .trim()
    .min(1, "Father's contact number is required")
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  motherName: z.string().trim().min(1, "Mother's name is required"),
  motherOccupation: z.string().trim().min(1, "Mother's occupation is required"),
  motherContactNo: z
    .string()
    .trim()
    .min(1, "Mother's contact number is required")
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
});

// Define the Local Guardian schema
const localGuardianValidationSchema = z.object({
  name: z.string().trim().min(1, "Local guardian's name is required"),
  occupation: z
    .string()
    .trim()
    .min(1, "Local guardian's occupation is required"),
  contactNo: z
    .string()
    .trim()
    .min(1, "Local guardian's contact number is required")
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  address: z.string().trim().min(1, "Local guardian's address is required"),
});

// Define the Student schema
const studentValidationSchema = z.object({
  id: z.string().trim().min(1, 'Student ID is required'),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be one of: male, female, other' }),
  }),
  dateOfBirth: z.string().trim().optional(),
  email: z.string().trim().email('Invalid email address'),
  contactNo: z
    .string()
    .trim()
    .min(1, 'Contact number is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  emergencyContactNo: z
    .string()
    .trim()
    .min(1, 'Emergency contact number is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
      errorMap: () => ({
        message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
      }),
    })
    .optional(),
  presentAddress: z.string().trim().min(1, 'Present address is required'),
  permanentAddress: z.string().trim().min(1, 'Permanent address is required'),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().trim().optional(),
  isActive: z
    .enum(['active', 'blocked'], {
      errorMap: () => ({
        message: 'Status must be either "active" or "blocked"',
      }),
    })
    .default('active'),
});

export default studentValidationSchema;
