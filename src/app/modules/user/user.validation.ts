import { z } from 'zod';

const userValidationSchema = z.object({
  id: z.string(),
  password: z.string().max(15, {
    message: 'password can not be more than 15 characters',
  }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(['admin', 'student', 'faculty']),
  status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  isDeleted: z.boolean().optional().default(false),
});

export const UserValidation = {
  userValidationSchema,
};
