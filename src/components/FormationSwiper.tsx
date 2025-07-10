import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, Play, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRatingDisplay } from "./StarRatingDisplay";
import { ratingService } from "@/services/ratingService";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

interface FormationSwiperProps {
  onFormationClick: (formation: Formation) => void;
}

const FormationSwiper = ({ onFormationClick }: FormationSwiperProps) => {
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const [swiper, setSwiper] = React.useState<any>(null);
  const [formations, setFormations] = React.useState<Formation[]>([]);

  useEffect(() => {
    const loadFormations = () => {
      const sampleFormations: Formation[] = [
        {
          id: 1,
          title: "Introduction aux Réseaux",
          instructor: "Marie Dubois",
          duration: "2h 30min",
          progress: 75,
          status: "in-progress",
          rating: 4.5,
          studentsCount: 128,
          image: "/placeholder.svg",
          category: "Réseau",
          level: "beginner",
          description: "Apprenez les bases des réseaux informatiques"
        },
        {
          id: 2,
          title: "Sécurité des Systèmes d'Information",
          instructor: "Jean-Pierre Leclerc",
          duration: "3h 15min",
          progress: 30,
          status: "in-progress",
          rating: 4.2,
          studentsCount: 95,
          image: "/placeholder.svg",
          category: "Sécurité",
          level: "intermediate",
          description: "Protégez vos systèmes contre les menaces"
        },
        {
          id: 3,
          title: "Administration Linux",
          instructor: "Sophie Martin",
          duration: "2h 45min",
          progress: 100,
          status: "completed",
          rating: 4.8,
          studentsCount: 155,
          image: "/placeholder.svg",
          category: "Système",
          level: "advanced",
          description: "Maîtrisez l'administration des serveurs Linux",
          completedAt: "2024-03-15",
          certificate: {
            issued: true,
            date: "2024-03-15"
          }
        },
        {
          id: 4,
          title: "Développement Web Avancé",
          instructor: "Lucie Garnier",
          duration: "4h 00min",
          progress: 0,
          status: "not-started",
          rating: 0,
          studentsCount: 62,
          image: "/placeholder.svg",
          category: "Développement",
          level: "intermediate",
          description: "Créez des applications web performantes"
        }
      ];

      const storedCourses = JSON.parse(localStorage.getItem('moov_test_courses') || '[]');
      const combinedFormations = [...sampleFormations, ...storedCourses.map((course: any) => ({
        ...course,
        progress: Math.floor(Math.random() * 100),
        status: Math.random() > 0.5 ? "in-progress" : "completed",
        studentsCount: Math.floor(Math.random() * 200) + 50,
        image: "/placeholder.svg"
      }))];

      setFormations(combinedFormations);
    };

    loadFormations();
  }, []);

  const handleFormationClick = (formation: Formation) => {
    console.log("Formation clicked:", formation);
    onFormationClick(formation);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "not-started": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="relative w-full">
      <style>
        {`
          .formation-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: rgba(59, 130, 246, 0.5);
            opacity: 1;
            margin: 0 4px;
          }
          .formation-swiper .swiper-pagination-bullet-active {
            background: #3b82f6;
            transform: scale(1.2);
          }
          .formation-card {
            transition: all 0.3s ease;
          }
          .formation-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      {/* Custom Navigation Buttons */}
      <button
        ref={navigationPrevRef}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        aria-label="Formation précédente"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>

      <button
        ref={navigationNextRef}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        aria-label="Formation suivante"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 32 },
          1280: { slidesPerView: 4, spaceBetween: 32 },
        }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }
        }}
        onSwiper={setSwiper}
        className="formation-swiper pb-12"
      >
        {formations.map((formation) => (
          <SwiperSlide key={formation.id}>
            <Card 
              className="formation-card cursor-pointer h-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-md hover:shadow-xl"
              onClick={() => handleFormationClick(formation)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={cn("text-xs font-medium", getLevelColor(formation.level))}>
                    {formation.level === "beginner" ? "Débutant" : 
                     formation.level === "intermediate" ? "Intermédiaire" : "Avancé"}
                  </Badge>
                  {formation.certificate?.issued && (
                    <Award className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                  {formation.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{formation.instructor}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formation.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{formation.studentsCount}</span>
                    </div>
                  </div>

                  <StarRatingDisplay 
                    rating={ratingService.getAverageRating(formation.id.toString())} 
                    size="sm" 
                  />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium text-gray-900">{formation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn("h-2 rounded-full transition-all duration-300", getStatusColor(formation.status))}
                        style={{ width: `${formation.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="text-xs">
                      {formation.category}
                    </Badge>
                    <Button size="sm" className="h-8 px-3">
                      <Play className="h-3 w-3 mr-1" />
                      {formation.status === "completed" ? "Revoir" : 
                       formation.status === "in-progress" ? "Continuer" : "Commencer"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FormationSwiper;
