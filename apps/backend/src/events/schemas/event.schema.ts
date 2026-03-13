// import * as yup from 'yup';

// export const eventSchema = yup.object({
//   title: yup
//     .string()
//     .trim()
//     .min(3, 'Title is too short')
//     .max(100, 'Title is too long')
//     .required('Title is required'),

//   description: yup
//     .string()
//     .trim()
//     .transform((value: string) => (value === '' ? null : value))
//     .nullable()
//     .optional(),

//   date: yup.date().min(new Date(), 'Date cannot be in the past').required('Date is required'),

//   location: yup.string().trim().required('Location is required'),

//   capacity: yup
//     .number()
//     .transform((value: unknown, originalValue: unknown) =>
//       String(originalValue).trim() === '' ? null : value,
//     )
//     .positive('Capacity must be a positive number')
//     .integer('Capacity must be an integer')
//     .nullable()
//     .optional(),

//   category: yup
//     .string()
//     .trim()
//     .transform((value: string) => (value === '' ? null : value))
//     .nullable()
//     .optional(),

//   visibility: yup
//     .string()
//     .oneOf(['Public', 'Private'], 'Visibility must be Public or Private')
//     .default('Public')
//     .required(),
// });
import * as yup from 'yup';

export const eventSchema = yup.object({
  title: yup.string().trim().min(3).required(),
  description: yup.string().trim().optional(),
  date: yup.date().required(),
  location: yup.string().trim().required(),
  capacity: yup
    .number()
    .transform((value: unknown, originalValue: unknown) => {
      return originalValue === '' ? null : value;
    })
    .nullable()
    .optional(),
  visibility: yup.string().oneOf(['Public', 'Private']).default('Public'),
  category: yup.string().optional(),
});
