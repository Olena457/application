
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { TagsInput } from "../components/TagsInput";
import { VisibilityFields } from "../components/VisibilityFields";
import { FormActions } from "../components/FormActions";
import { eventSchema } from "../utils/event.validation";
import type { EventFormData } from "../utils/event.validation";
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
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: "",
      visibility: "Public",
      tags: [],
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        tags: initialValues.tags || [],
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
          borderRadius: "16px",
          gap: 1,
          px: { xs: 1, sm: 2 },
          width: "100%",
          "& .MuiFormLabel-asterisk": {
            color: "red",
          },
        }}
      >
        <TextField
          {...register("title")}
          label="Event Title"
          fullWidth
          margin="normal"
          error={!!errors.title}
          placeholder="e.g., Teach Conference 2026"
          required
          helperText={errors.title?.message}
          slotProps={{
            htmlInput: {
              maxLength: 50,
            },
          }}
        />

        <TextField
          {...register("description")}
          label="Description"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          placeholder="Describe what makes your event special..."
          slotProps={{
            htmlInput: {
              maxLength: 300,
            },
          }}
          error={!!errors.description}
          helperText={
            errors.description
              ? errors.description.message
              : `${watch("description")?.length || 0}/300`
          }
        />
        <DateTimePicker
          label="Date & Time"
          disablePast
          value={dateValue}
          onChange={(v) =>
            setValue("date", v || new Date(), { shouldValidate: true })
          }
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              required: true,
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
          placeholder="e.g., Convention Center, San Francisco"
          error={!!errors.location}
          required
          helperText={
            errors.location
              ? errors.location.message
              : `${watch("location")?.length || 0}/70`
          }
          slotProps={{
            htmlInput: {
              maxLength: 70,
            },
          }}
        />
        <TagsInput control={control} name="tags" label="Select categories" />
        <Box sx={{ mt: 1 }}>
          <TextField
            {...register("capacity")}
            label="Capacity (optional)"
            type="number"
            fullWidth
            placeholder="Leave empty for unlimited"
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
            slotProps={{
              htmlInput: { min: 1 },
            }}
            onChange={(e) => {
              const val = e.target.value;

              if (val === "") {
                setValue("capacity", undefined, { shouldValidate: true });
                return;
              }

              const num = Number(val);
              const finalValue = num < 1 ? 1 : num;

              setValue("capacity", finalValue, { shouldValidate: true });
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            Maximum number of participants. Leave empty for unlimited capacity.
          </Typography>
        </Box>
        <VisibilityFields
          value={visibilityValue || "Public"}
          onChange={(val) => setValue("visibility", val)}
        />
        {apiError && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {apiError}
          </Typography>
        )}
        <FormActions
          isLoading={isLoading}
          onCancel={onCancel}
          submitLabel={submitLabel}
        />
      </Box>
    </LocalizationProvider>
  );
};
