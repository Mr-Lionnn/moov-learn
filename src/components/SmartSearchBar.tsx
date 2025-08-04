import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  instructor?: string;
  description?: string;
  category?: string;
  duration?: string;
  progress?: number;
}

interface SmartSearchBarProps {
  courses: Course[];
  placeholder?: string;
}

const SmartSearchBar = ({ courses, placeholder = "Rechercher formations, modules, créateurs..." }: SmartSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses([]);
      setIsOpen(false);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const matches = courses.filter(course => {
      const titleMatch = course.title?.toLowerCase().includes(searchLower);
      const instructorMatch = course.instructor?.toLowerCase().includes(searchLower);
      const descriptionMatch = course.description?.toLowerCase().includes(searchLower);
      const categoryMatch = course.category?.toLowerCase().includes(searchLower);
      
      return titleMatch || instructorMatch || descriptionMatch || categoryMatch;
    }).slice(0, 8); // Show more suggestions

    setFilteredCourses(matches);
    setIsOpen(matches.length > 0);
  }, [searchQuery, courses]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCourseSelect = (course: Course) => {
    setSearchQuery("");
    setIsOpen(false);
    // Navigate directly to the formation module (first lesson/module)
    navigate(`/course/${course.id}?start=true`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (filteredCourses.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 text-center h-12 text-base shadow-sm border-2 focus:border-primary/50"
        />
      </div>

      {isOpen && filteredCourses.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-2">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b">
              {filteredCourses.length} formation{filteredCourses.length > 1 ? 's' : ''} trouvée{filteredCourses.length > 1 ? 's' : ''}
            </div>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors rounded-md"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {course.title}
                  </h4>
                  {course.instructor && (
                    <p className="text-xs text-gray-500 truncate">
                      par {course.instructor}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {course.duration && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.progress !== undefined && (
                      <div className="text-xs text-primary font-medium">
                        {course.progress}% complété
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchBar;