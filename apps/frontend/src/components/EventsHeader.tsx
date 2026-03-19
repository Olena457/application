import { SearchBar } from "./SearchBar";

interface EventsHeaderProps {
  searchQuery: string;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  onSearchChange: (val: string) => void;
}

export const EventsHeader = ({
  searchQuery,
  onSearchChange,
  selectedTags, 
  onTagsChange, 
  availableTags, 
}: EventsHeaderProps) => {
  return (
    <SearchBar
      value={searchQuery}
      onChange={onSearchChange}
      selectedTags={selectedTags}
      onTagsChange={onTagsChange}
      availableTags={availableTags}
    />
  );
};