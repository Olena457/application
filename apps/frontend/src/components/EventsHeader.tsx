import { Typography } from "@mui/material";
import { SearchBar } from "./SearchBar";

interface EventsHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const EventsHeader = ({
  searchQuery,
  onSearchChange,
}: EventsHeaderProps) => (
  <>
    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
      Discover Events
    </Typography>

    <SearchBar value={searchQuery} onChange={onSearchChange} />
  </>
);

