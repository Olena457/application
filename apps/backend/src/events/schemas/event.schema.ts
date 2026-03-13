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
