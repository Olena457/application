
import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const nameRegex = /^[a-zA-Za-яА-ЯіІїЇєЄґҐ' ]+$/;

export const registerSchema = yup
  .object({
    email: yup
      .string()
      .matches(emailRegex, "Please enter a valid email address")
      .required("Email is required"),
    name: yup
      .string()
      .max(50, "Name is too long")
      .matches(nameRegex, "Name must contain only letters")
      .optional()
      .default(""),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(
        passwordRegex,
        "Password must include uppercase, lowercase, number and special character",
      ),
  })
  .required();

export type RegisterFormData = yup.InferType<typeof registerSchema>;
