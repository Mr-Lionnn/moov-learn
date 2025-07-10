
import { useState } from "react";
import { 
  Command,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/useSearch";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { SearchBarProps, SearchResult } from "@/types/search";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import SearchHistory from "@/components/search/SearchHistory";

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useSearch(onSearchResults);
  const { searchHistory, addToHistory } = useSearchHistory();

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery(result.title);
    setIsOpen(false);
    addToHistory(result.title);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchResults?.([]);
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    setIsOpen(false);
  };

  const handleInputChange = (query: string) => {
    setSearchQuery(query);
    setIsOpen(true);
  };

  return (
    <div className="relative w-full max-w-md">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onClear={clearSearch}
          />
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              <SearchResults 
                results={searchResults}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSelect={handleSearchSelect}
              />
              
              {!searchQuery && (
                <SearchHistory 
                  history={searchHistory}
                  onSelect={handleHistorySelect}
                />
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
