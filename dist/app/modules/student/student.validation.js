"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the UserName schema
const userNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().trim().min(1, 'First name is required'),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .regex(/^[a-zA-Z]+$/, 'Last name must contain only alphabetic characters'),
});
// Define the Guardian schema
const guardianValidationSchema = zod_1.z.object({
    fatherName: zod_1.z.string().trim().min(1, "Father's name is required"),
    fatherOccupation: zod_1.z.string().trim().min(1, "Father's occupation is required"),
    fatherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, "Father's contact number is required")
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    motherName: zod_1.z.string().trim().min(1, "Mother's name is required"),
    motherOccupation: zod_1.z.string().trim().min(1, "Mother's occupation is required"),
    motherContactNo: zod_1.z
        .string()
        .trim()
        .min(1, "Mother's contact number is required")
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
});
// Define the Local Guardian schema
const localGuardianValidationSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Local guardian's name is required"),
    occupation: zod_1.z
        .string()
        .trim()
        .min(1, "Local guardian's occupation is required"),
    contactNo: zod_1.z
        .string()
        .trim()
        .min(1, "Local guardian's contact number is required")
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    address: zod_1.z.string().trim().min(1, "Local guardian's address is required"),
});
// Define the Student schema
const studentValidationSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, 'Student ID is required'),
    name: userNameValidationSchema,
    password: zod_1.z.string().trim().max(20, 'Password cannot exceed 20 characters'),
    gender: zod_1.z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender must be one of: male, female, other' }),
    }),
    dateOfBirth: zod_1.z.string().trim().optional(),
    email: zod_1.z.string().trim().email('Invalid email address'),
    contactNo: zod_1.z
        .string()
        .trim()
        .min(1, 'Contact number is required')
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    emergencyContactNo: zod_1.z
        .string()
        .trim()
        .min(1, 'Emergency contact number is required')
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    bloodGroup: zod_1.z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({
            message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
        }),
    })
        .optional(),
    presentAddress: zod_1.z.string().trim().min(1, 'Present address is required'),
    permanentAddress: zod_1.z.string().trim().min(1, 'Permanent address is required'),
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: zod_1.z.string().trim().optional(),
    isActive: zod_1.z
        .enum(['active', 'blocked'], {
        errorMap: () => ({
            message: 'Status must be either "active" or "blocked"',
        }),
    })
        .default('active'),
    isDeleted: zod_1.z.boolean(),
});
exports.default = studentValidationSchema;
