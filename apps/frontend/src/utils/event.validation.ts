import * as yup from "yup";

export const eventSchema = yup
  .object({
    title: yup.string().required("Title is required").min(3, "Title too short"),
    description: yup.string().optional().default(""),
    date: yup
      .date()
      .required("Date is required")
      .min(new Date(), "Date cannot be in the past"),
    location: yup.string().required("Location is required"),
    capacity: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .nullable()
      .optional()
      .min(1, "Capacity must be at least 1")
      .typeError("Capacity must be a number"),
    visibility: yup
      .string()
      .oneOf(["Public", "Private"])
      .required()
      .default("Public"),
    tags: yup
      .array()
      .of(yup.string())
      .max(5, "You can select up to 5 tags")
      .default([]),
  })
  .required();

export type EventFormData = yup.InferType<typeof eventSchema>;
