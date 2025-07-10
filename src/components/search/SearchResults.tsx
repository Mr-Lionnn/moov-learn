
import { Badge } from "@/components/ui/badge";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { BookOpen, User } from "lucide-react";
import { SearchResult } from "@/types/search";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  onSelect: (result: SearchResult) => void;
}

const SearchResults = ({ results, isLoading, searchQuery, onSelect }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Recherche en cours...
      </div>
    );
  }

  if (!isLoading && searchQuery && results.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Aucun résultat trouvé.
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading="Résultats">
      {results.map((result) => (
        <CommandItem
          key={result.id}
          onSelect={() => onSelect(result)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {result.type === 'course' ? (
              <BookOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <User className="h-4 w-4 text-green-500" />
            )}
            <div className="flex-1">
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-500">{result.instructor}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {result.category}
            </Badge>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default SearchResults;
