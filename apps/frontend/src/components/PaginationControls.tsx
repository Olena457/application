import { Pagination, Box } from "@mui/material";

interface Props {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export const PaginationControls = ({ page, count, onChange }: Props) => {
  if (count <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
};
