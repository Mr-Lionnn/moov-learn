
import { useState, useEffect } from "react";
import { testDataService } from "@/services/testDataService";
import { SearchResult } from "@/types/search";

export const useSearch = (onSearchResults?: (results: SearchResult[]) => void) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
            instructor: 'Instructeur Expert', // Default instructor name since TestCourse doesn't have instructor field
            category: course.category || 'Formation',
            type: 'course'
          });
        }
      });

      // Search by category
      const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
      categories.forEach(category => {
        if (category && category.toLowerCase().includes(query.toLowerCase())) {
          const categoryCourses = courses.filter(c => c.category === category);
          results.push({
            id: `category-${category}`,
            title: category,
            instructor: `${categoryCourses.length} cours`,
            category: 'Catégorie',
            type: 'instructor' // Reusing this type for categories
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

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    performSearch
  };
};
