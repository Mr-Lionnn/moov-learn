import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Trophy,
  Target,
  Search,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import FormationSwiper from "@/components/FormationSwiper";
import Header from "@/components/Header";

interface Formation {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  rating: number;
  studentsCount: number;
  image: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  nextLesson?: string;
  completedAt?: string;
  certificate?: {
    issued: boolean;
    date: string;
  };
}

const MyTrainings = () => {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFormationClick = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen moov-gradient-subtle">
      {/* Main Navigation Header */}
      <Header onShowAdminPanel={() => setShowAdminPanel(true)} />

      {/* Page Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Mes Formations
            </h1>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher des formations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Bienvenue, {user?.name || "Utilisateur"}!
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Suivez votre parcours de formation personnalisé.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Formations en cours
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    3
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Formations terminées
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    1
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Prochain objectif
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Compléter le module "Sécurité des Réseaux"
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Formations Swiper Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Formations Recommandées
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos formations expertement conçues pour développer vos compétences en réseaux et technologies.
            </p>
          </div>
          
          <FormationSwiper onFormationClick={handleFormationClick} />
        </div>
      </section>

      {/* Detail Modal */}
      {showDetailModal && selectedFormation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedFormation.title}
                </h2>
                <p className="text-gray-700 mb-6">
                  {selectedFormation.description}
                </p>
                <div className="flex justify-between items-center">
                  <Button onClick={() => setShowDetailModal(false)}>
                    Fermer
                  </Button>
                  <Button>
                    Commencer la formation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrainings;
