import * as yup from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const registerSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Za-яА-ЯіІєЄїЇґҐ\s]+$/, 'Name must contain only letters')
    .required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      passwordRegex,
      'Password must include uppercase, lowercase, number and special character',
    ),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
