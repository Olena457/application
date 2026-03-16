import { Autocomplete, Chip, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";

const AVAILABLE_TAGS = [
  "Tech",
  "Education",
  "Social",
  "Music",
  "Sport",
  "Workshop",
];

interface TagsInputProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const TagsInput = ({ control, name, label }: TagsInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          options={AVAILABLE_TAGS}
          value={value || []}
          onChange={(_, newValue) => onChange(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  {...tagProps}
                  variant="outlined"
                  size="small"
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder="Select categories"
              margin="normal"
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
          sx={{ mt: 2 }}
        />
      )}
    />
  );
};
