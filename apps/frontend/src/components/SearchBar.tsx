
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

export const SearchBar = ({
  value,
  onChange,
  selectedTags,
  onTagsChange,
  availableTags,
}: SearchBarProps) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        maxWidth: 500,
        width: "100%",
        flex: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Search size={20} color="#1e88e5" />
        <Typography variant="subtitle1" fontWeight="bold">
          Discover Events
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search events by title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          slotProps={{
            input: {
              endAdornment: value && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => onChange("")}
                    edge="end"
                    size="small"
                  >
                    <X size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
            },
          }}
        />

        <Autocomplete
          multiple
          size="small"
          options={availableTags}
          value={selectedTags}
          onChange={(_event, newValue) => onTagsChange(newValue)}
          renderValue={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  {...tagProps}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by Tags"
              placeholder={selectedTags.length === 0 ? "Select tags" : ""}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(67, 66, 66, 0.3)",
                  opacity: 1,
                },
              }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>
    </Paper>
  );
};