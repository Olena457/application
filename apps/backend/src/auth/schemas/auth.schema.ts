import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Za-яА-ЯіІєЄїЇґҐ\s]+$/, 'Name must contain only letters')
    .required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must include uppercase, lowercase, number and special character',
    )
    .required('Password is required'),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
