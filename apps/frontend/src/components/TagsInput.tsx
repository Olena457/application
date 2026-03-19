
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
          onChange={(_, newValue) => {
            if (newValue.length <= 5) {
              onChange(newValue);
            }
          }}
          getOptionDisabled={(option) => 
            (value?.length >= 5) && !value.includes(option)
          }
          renderValue={(tagValue, getTagProps) =>
            tagValue.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  {...tagProps}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: '6px' }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={value?.length >= 5 ? "" : "Select categories"}
              margin="normal"
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
          sx={{ 
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px"
            }
          }}
        />
      )}
    />
  );
};
