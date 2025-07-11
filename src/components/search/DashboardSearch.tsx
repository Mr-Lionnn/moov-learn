import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  User, 
  BookOpen,
  TrendingUp,
  X
} from "lucide-react";
import { testDataService } from "@/services/testDataService";

interface SearchResult {
  id: string;
  type: 'course' | 'module' | 'instructor';
  title: string;
  description: string;
  instructor?: string;
  rating?: number;
  duration?: string;
  category?: string;
  level?: string;
  tags?: string[];
}

interface DashboardSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

const DashboardSearch = ({ onResultClick }: DashboardSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mock search data
  const searchableContent: SearchResult[] = [
    {
      id: '1',
      type: 'course',
      title: 'Excellence en Service Client',
      description: 'Formation complète sur les techniques de service client moderne',
      instructor: 'Sophie Martin',
      rating: 4.8,
      duration: '2h 30min',
      category: 'Service Client',
      level: 'Intermédiaire',
      tags: ['communication', 'satisfaction client', 'gestion des conflits']
    },
    {
      id: '2',
      type: 'course',
      title: 'Conformité RGPD',
      description: 'Guide complet pour la mise en conformité RGPD',
      instructor: 'Marc Dubois',
      rating: 4.6,
      duration: '1h 45min',
      category: 'Juridique',
      level: 'Avancé',
      tags: ['rgpd', 'protection des données', 'conformité']
    },
    {
      id: '3',
      type: 'course',
      title: 'Techniques de Vente Avancées',
      description: 'Stratégies de vente consultative et closing efficace',
      instructor: 'Julie Renault',
      rating: 4.9,
      duration: '3h 15min',
      category: 'Vente',
      level: 'Avancé',
      tags: ['vente', 'négociation', 'closing', 'prospection']
    },
    {
      id: '4',
      type: 'instructor',
      title: 'Sophie Martin',
      description: 'Experte en formation service client avec 15 ans d\'expérience',
      category: 'Formateur',
      tags: ['service client', 'communication', 'formation']
    }
  ];

  const categories = ['Service Client', 'Juridique', 'Vente', 'Leadership', 'Technologie'];
  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.instructor && item.instructor.toLowerCase().includes(query.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );

      // Apply category filter
      const categoryFiltered = selectedCategory 
        ? filtered.filter(item => item.category === selectedCategory)
        : filtered;

      // Apply level filter
      const levelFiltered = selectedLevel
        ? categoryFiltered.filter(item => item.level === selectedLevel)
        : categoryFiltered;

      setResults(levelFiltered);
      setIsOpen(levelFiltered.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, selectedCategory, selectedLevel]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    handleSearch(result.title);
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedLevel("");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'instructor':
        return <User className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher des formations, modules, instructeurs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(query.length >= 2 && results.length > 0)}
          className="pl-10 pr-12 py-3 text-base"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Filtres de Recherche
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Niveau</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Tous les niveaux</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Effacer
              </Button>
              <Button size="sm" onClick={() => setShowFilters(false)}>
                Appliquer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-40 shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {result.type === 'course' ? 'Formation' : 'Instructeur'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {result.instructor && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.instructor}
                        </span>
                      )}
                      {result.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.duration}
                        </span>
                      )}
                      {result.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {result.rating}
                        </span>
                      )}
                      {result.level && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {result.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {query.length === 0 && recentSearches.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-40 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recherches récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => setQuery(search)}
              >
                <span className="text-sm text-gray-700">{search}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardSearch;