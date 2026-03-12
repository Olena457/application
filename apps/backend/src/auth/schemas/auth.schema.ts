import * as yup from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Za-яА-ЯіІїЇєЄґҐ' ]+$/;

export const registerSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email('Please enter a valid email address')
    .required('Email is required'),

  name: yup
    .string()
    .trim()
    .max(50, 'Name is too long')
    .matches(nameRegex, 'Name must contain only letters')
    .transform((value: string) => (value === '' ? undefined : value))
    .optional(),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      passwordRegex,
      'Password must include uppercase, lowercase, number and special character',
    )
    .required('Password is required'),
});

export const loginSchema = yup.object({
  email: yup.string().trim().lowercase().email().required(),
  password: yup.string().required(),
});
