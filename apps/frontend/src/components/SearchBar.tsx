import { useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box sx={{ mb: 4, maxWidth: 400 }}>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={isFocused || value ? "" : "Search events..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {!isFocused && !value && <Search size={18} color="#9e9e9e" />}
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton onClick={() => onChange("")} edge="end" size="small">
                <X size={18} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fcfcfc",
          },
          "& input": {
            py: 1, 
          },
        }}
      />
    </Box>
  );
};
