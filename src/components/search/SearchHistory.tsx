
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Clock } from "lucide-react";

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
}

const SearchHistory = ({ history, onSelect }: SearchHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading="Recherches récentes">
      {history.map((query, index) => (
        <CommandItem
          key={index}
          onSelect={() => onSelect(query)}
          className="cursor-pointer"
        >
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          {query}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default SearchHistory;
