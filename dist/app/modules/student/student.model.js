"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    middleName: { type: String, trim: true },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isAlpha(value),
            message: '{VALUE} is not a valid character',
        },
    },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        required: [true, "Father's name is required"],
        trim: true,
    },
    fatherOccupation: {
        type: String,
        required: [true, "Father's occupation is required"],
        trim: true,
    },
    fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required"],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value),
            message: '{VALUE} is not a valid phone number',
        },
    },
    motherName: {
        type: String,
        required: [true, "Mother's name is required"],
        trim: true,
    },
    motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required"],
        trim: true,
    },
    motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required"],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value),
            message: '{VALUE} is not a valid phone number',
        },
    },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Local guardian's name is required"],
        trim: true,
    },
    occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required"],
        trim: true,
    },
    contactNo: {
        type: String,
        required: [true, "Local guardian's contact number is required"],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value),
            message: '{VALUE} is not a valid phone number',
        },
    },
    address: {
        type: String,
        required: [true, "Local guardian's address is required"],
        trim: true,
    },
});
const studentSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        unique: true,
        ref: 'User',
    },
    name: {
        type: userNameSchema,
        required: [true, 'Student name is required'],
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: 'Gender must be one of: male, female, other',
        },
        required: [true, 'Gender is required'],
        trim: true,
    },
    dateOfBirth: { type: String, trim: true },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isEmail(value),
            message: '{VALUE} is not a valid email',
        },
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value),
            message: '{VALUE} is not a valid phone number',
        },
    },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required'],
        trim: true,
        validate: {
            validator: (value) => validator_1.default.isMobilePhone(value),
            message: '{VALUE} is not a valid phone number',
        },
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
        },
        trim: true,
    },
    presentAddress: {
        type: String,
        required: [true, 'Present address is required'],
        trim: true,
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required'],
        trim: true,
    },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required'],
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian information is required'],
    },
    profileImg: { type: String, trim: true },
}, {
    toJSON: {
        virtuals: true,
    },
});
// virtual
studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName}  ${this.name.lastName}`;
});
// Query Middleware Hook
studentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
studentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// creating a custom static method
studentSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Student.findOne({ id });
        return existingUser;
    });
};
exports.Student = (0, mongoose_1.model)('students', studentSchema);
