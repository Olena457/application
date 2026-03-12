

import { useEffect } from "react"; 
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const eventSchema = yup
  .object({
    title: yup.string().required("Title is required").min(3, "Title too short"),
    description: yup.string().optional().default(""),
    date: yup.date().required("Date is required"),
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
  })
  .required();

export type EventFormData = yup.InferType<typeof eventSchema>;

interface EventFormProps {
  initialValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  apiError?: string | null;
  submitLabel: string;
}

export const EventForm = ({
  initialValues,
  onSubmit,
  isLoading,
  onCancel,
  apiError,
  submitLabel,
}: EventFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, 
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema) as any,
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      date: initialValues?.date || new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: initialValues?.location || "",
      capacity: initialValues?.capacity || undefined,
      visibility:
        (initialValues?.visibility as "Public" | "Private") || "Public",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        title: initialValues.title || "",
        description: initialValues.description || "",
        date: initialValues.date || new Date(),
        location: initialValues.location || "",
        capacity: initialValues.capacity || undefined,
        visibility: initialValues.visibility || "Public",
      });
    }
  }, [initialValues, reset]);

  const dateValue = watch("date");
  const visibilityValue = watch("visibility");

  const handleFormSubmit: SubmitHandler<EventFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "auto", 
          overflowY: "visible", 
          px: 2,
          width: "100%",
        }}
      >
        <TextField
          {...register("title")}
          label="Event Title"
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title?.message}
          required
        />
        <TextField
          {...register("description")}
          label="Description"
          multiline
          rows={3}
          fullWidth
          margin="normal"
        />
        <DateTimePicker
          label="Date & Time"
          value={dateValue}
          onChange={(v) =>
            setValue("date", v || new Date(), { shouldValidate: true })
          }
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              error: !!errors.date,
              helperText: errors.date?.message as string,
            },
          }}
        />
        <TextField
          {...register("location")}
          label="Location"
          fullWidth
          margin="normal"
          error={!!errors.location}
          helperText={errors.location?.message}
          required
        />

        <Box sx={{ mt: 1 }}>
          <TextField
            {...register("capacity")}
            label="Capacity (optional)"
            type="number"
            fullWidth
            placeholder="Leave empty for unlimited"
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
            onChange={(e) =>
              setValue(
                "capacity",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            Maximum number of participants. Leave empty for unlimited capacity.
          </Typography>
        </Box>

        <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }}>
          <FormLabel sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
            Visibility
          </FormLabel>
          <RadioGroup
            value={visibilityValue || "Public"}
            sx={{ pl: 1 }}
            onChange={(e) =>
              setValue("visibility", e.target.value as "Public" | "Private")
            }
          >
            <FormControlLabel
              value="Public"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  <strong>Public</strong> - Anyone can see and join
                </Typography>
              }
            />
            <FormControlLabel
              value="Private"
              control={<Radio size="small" />}
              label={
                <Typography variant="body2">
                  <strong>Private</strong> - Only invited people
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>

        {apiError && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {apiError}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: "auto", pt: 2, pb: 2 }}>
          <Button
            variant="contained"
            onClick={onCancel}
            disabled={isLoading}
            sx={{
              flex: 1,
              borderRadius: "10px",
              textTransform: "none",
              py: 1,
              fontWeight: 600,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#0582ff" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              flex: 1,
              borderRadius: "10px",
              textTransform: "none",
              py: 1,
              fontWeight: 600,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#0582ff" },
            }}
          >
            {isLoading ? "Processing..." : submitLabel}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
