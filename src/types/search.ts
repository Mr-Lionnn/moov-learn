
export interface SearchResult {
  id: string;
  title: string;
  instructor: string;
  category: string;
  type: 'course' | 'instructor';
}

export interface SearchBarProps {
  onSearchResults?: (results: SearchResult[]) => void;
}
