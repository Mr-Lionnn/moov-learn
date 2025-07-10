
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Clock, User, BookOpen, X } from "lucide-react";
import { testDataService } from "@/services/testDataService";

interface SearchResult {
  id: string;
  title: string;
  instructor: string;
  category: string;
  type: 'course' | 'instructor';
}

interface SearchBarProps {
  onSearchResults?: (results: SearchResult[]) => void;
}

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('moov_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    
    try {
      const courses = testDataService.getTestCourses();
      const results: SearchResult[] = [];
      
      // Search by course title
      courses.forEach(course => {
        if (course.title.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: course.id,
            title: course.title,
            instructor: course.instructor || 'Instructeur',
            category: course.category || 'Formation',
            type: 'course'
          });
        }
      });

      // Search by instructor name
      const instructors = [...new Set(courses.map(c => c.instructor).filter(Boolean))];
      instructors.forEach(instructor => {
        if (instructor && instructor.toLowerCase().includes(query.toLowerCase())) {
          const instructorCourses = courses.filter(c => c.instructor === instructor);
          results.push({
            id: `instructor-${instructor}`,
            title: instructor,
            instructor: `${instructorCourses.length} cours`,
            category: 'Formateur',
            type: 'instructor'
          });
        }
      });

      setSearchResults(results);
      onSearchResults?.(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery(result.title);
    setIsOpen(false);
    
    // Add to search history
    const newHistory = [result.title, ...searchHistory.filter(h => h !== result.title)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('moov_search_history', JSON.stringify(newHistory));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    onSearchResults?.([]);
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher formations ou formateurs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {isLoading && (
                <div className="p-4 text-center text-sm text-gray-500">
                  Recherche en cours...
                </div>
              )}
              
              {!isLoading && searchQuery && searchResults.length === 0 && (
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              )}
              
              {!searchQuery && searchHistory.length > 0 && (
                <CommandGroup heading="Recherches récentes">
                  {searchHistory.map((query, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleHistorySelect(query)}
                      className="cursor-pointer"
                    >
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {query}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {searchResults.length > 0 && (
                <CommandGroup heading="Résultats">
                  {searchResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSearchSelect(result)}
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
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
