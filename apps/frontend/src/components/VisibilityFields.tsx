import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

interface VisibilityFieldsProps {
  value: string;
  onChange: (value: "Public" | "Private") => void;
}

export const VisibilityFields = ({
  value,
  onChange,
}: VisibilityFieldsProps) => (
  <FormControl component="fieldset" sx={{ mt: 3, mb: 2 }}>
    <FormLabel sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}>
      Visibility
    </FormLabel>
    <RadioGroup
      value={value}
      sx={{ pl: 1 }}
      onChange={(e) => onChange(e.target.value as any)}
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
);
