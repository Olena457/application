import { Box, Skeleton } from "@mui/material";

export const EventDetailsSkeleton = () => (
  <Box sx={{ mt: 4 }}>
    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
  </Box>
);
