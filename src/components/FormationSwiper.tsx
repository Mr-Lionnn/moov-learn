import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp, 
  Award,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import StarRatingDisplay from "./StarRatingDisplay";
import { ratingService } from "@/services/ratingService";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  progress: number;
  instructor: string;
  category: string;
  completionRate: number;
  enrolledUsers: number;
  averageScore: number;
  isMandatory: boolean;
}

const FormationSwiper = ({ onFormationClick }: { onFormationClick: (formation: Formation) => void }) => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    // Load formations and update ratings in real-time
    const loadFormations = () => {
      const mockFormations: Formation[] = [
        {
          id: "tcp-ip",
          title: "Fondamentaux des Réseaux TCP/IP",
          description: "Apprenez les bases essentielles du protocole TCP/IP et de l'architecture réseau",
          duration: "4h 30min",
          level: "beginner",
          progress: 45,
          instructor: "Marie Dubois",
          category: "Réseaux",
          completionRate: 87,
          enrolledUsers: 142,
          averageScore: 78,
          isMandatory: true
        },
        {
          id: "security",
          title: "Sécurité Informatique Avancée",
          description: "Maîtrisez les concepts avancés de cybersécurité et protection des données",
          duration: "6h 15min",
          level: "advanced",
          progress: 23,
          instructor: "Jean Martin",
          category: "Sécurité",
          completionRate: 72,
          enrolledUsers: 98,
          averageScore: 82,
          isMandatory: false
        },
        {
          id: "linux-admin",
          title: "Administration Système Linux",
          description: "Devenez expert en administration de serveurs Linux et gestion système",
          duration: "8h 00min",
          level: "intermediate",
          progress: 67,
          instructor: "Sophie Laurent",
          category: "Systèmes",
          completionRate: 91,
          enrolledUsers: 156,
          averageScore: 85,
          isMandatory: true
        },
        {
          id: "cloud-basics",
          title: "Introduction au Cloud Computing",
          description: "Découvrez les fondamentaux du cloud et des services AWS, Azure, GCP",
          duration: "5h 45min",
          level: "beginner",
          progress: 12,
          instructor: "Pierre Moreau",
          category: "Cloud",
          completionRate: 65,
          enrolledUsers: 89,
          averageScore: 76,
          isMandatory: false
        }
      ];
      
      setFormations(mockFormations);
    };

    loadFormations();

    // Listen for rating updates to refresh formation data
    const handleRatingUpdate = () => loadFormations();
    window.addEventListener('ratingUpdated', handleRatingUpdate);

    return () => {
      window.removeEventListener('ratingUpdated', handleRatingUpdate);
    };
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner": return "Débutant";
      case "intermediate": return "Intermédiaire";
      case "advanced": return "Avancé";
      default: return level;
    }
  };

  return (
    <div className="formation-swiper-container relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 32,
          }
        }}
        className="pb-12"
      >
        {formations.map((formation) => (
          <SwiperSlide key={formation.id}>
            <Card 
              className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0 shadow-lg"
              onClick={() => onFormationClick(formation)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={`${getLevelColor(formation.level)} border text-xs font-medium`}>
                    {getLevelText(formation.level)}
                  </Badge>
                  {formation.isMandatory && (
                    <Badge variant="destructive" className="text-xs">
                      Obligatoire
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {formation.title}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {formation.description}
                </p>
                
                {/* Star Rating Display */}
                <div className="mb-4">
                  <StarRatingDisplay 
                    moduleId={formation.id}
                    size="sm"
                    showValue={true}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Progression</span>
                      <span className="font-semibold text-gray-900">{formation.progress}%</span>
                    </div>
                    <Progress value={formation.progress} className="h-2" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formation.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formation.enrolledUsers} inscrits</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formation.completionRate}% réussite</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{formation.averageScore}/100</span>
                    </div>
                  </div>

                  {/* Instructor and Category */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Instructeur:</span> {formation.instructor}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formation.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border flex items-center justify-center hover:bg-gray-50 transition-colors">
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border flex items-center justify-center hover:bg-gray-50 transition-colors">
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>

      <style jsx global>{`
        .formation-swiper-container .swiper-pagination {
          bottom: 0 !important;
        }
        
        .formation-swiper-container .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .formation-swiper-container .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FormationSwiper;
