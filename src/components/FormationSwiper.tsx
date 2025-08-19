import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper/modules';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import StarRatingDisplay from "@/components/StarRatingDisplay";
import FormationInfoModal from "@/components/FormationInfoModal";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle, 
  Award,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ratingService } from "@/services/ratingService";
import { ContentFile } from "@/types/content";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Training {
  id: number | string;
  originalId?: string; // Keep track of the original string ID for navigation
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  status: string;
  rating: number;
  studentsCount: number;
  category: string;
  level: string;
  completedLessons: number;
  totalLessons: number;
  nextLesson: string | null;
  estimatedCompletion: string | null;
  completedDate?: string;
  certificate?: boolean;
}

interface FormationSwiperProps {
  trainings: Training[];
}

const FormationSwiper = ({ trainings }: FormationSwiperProps) => {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get average rating for a training module
  const getModuleRating = (title: string) => {
    const averageRating = ratingService.getModuleAverageRating(title);
    const ratingCount = ratingService.getModuleRatingCount(title);
    return { averageRating, ratingCount };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminée":
        return "bg-green-100 text-green-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Non commencée":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleContinueCourse = (training: Training) => {
    const courseId = training.originalId || training.id;
    console.log('🔥 Navigating to course with ID:', courseId, 'from training:', training);
    navigate(`/course/${courseId}`);
  };

  const handleStartCourse = (training: Training) => {
    const courseId = training.originalId || training.id;
    console.log('🔥 Starting course with ID:', courseId, 'from training:', training);
    navigate(`/course/${courseId}`);
  };

  const handleReviewCourse = (training: Training) => {
    const courseId = training.originalId || training.id;
    console.log('🔥 Reviewing course with ID:', courseId, 'from training:', training);
    navigate(`/course/${courseId}`);
  };

  const handleDownloadCertificate = (trainingTitle: string) => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Certificate of Completion\n\n' + trainingTitle + '\n\nAwarded to: Student\nDate: ' + new Date().toLocaleDateString();
    link.download = `certificate-${trainingTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReadMore = (training: Training) => {
    // Create detailed formation info
    const formationInfo = {
      id: training.id.toString(),
      title: training.title,
      description: `Formation complète en ${training.category} de niveau ${training.level}`,
      detailedContent: getDetailedContent(training),
      duration: training.duration,
      level: training.level as 'beginner' | 'intermediate' | 'advanced',
      participants: training.studentsCount,
      category: training.category,
      objectives: getObjectives(training),
      prerequisites: getPrerequisites(training),
      materials: getMaterials(training),
      hasDetailedInfo: true
    };

    setSelectedFormation(formationInfo);
    setIsModalOpen(true);
  };

  const getDetailedContent = (training: Training) => {
    const contents: { [key: string]: string } = {
      'Formation Moov': `
        <h3>Présentation complète des services Moov</h3>
        <p>Cette formation vous permettra de maîtriser l'ensemble des produits et services Moov pour mieux conseiller vos clients.</p>
        <h4>Modules inclus:</h4>
        <ul>
          <li>Intelligence Artificielle Moov - Vidéo de présentation</li>
          <li>Argumentaires de vente pour les services vocaux</li>
          <li>Guide pratique des services SVA</li>
          <li>Techniques de vente pour les commerciaux front office</li>
        </ul>
        <h4>Compétences acquises:</h4>
        <ul>
          <li>Présentation efficace des offres Moov</li>
          <li>Utilisation des outils d'Intelligence Artificielle</li>
          <li>Techniques de négociation avancées</li>
        </ul>
      `,
      'Service Client Excellence': `
        <h3>Excellence en Service Client</h3>
        <p>Développez vos compétences en service client pour offrir une expérience exceptionnelle à chaque interaction.</p>
        <h4>Contenu de la formation:</h4>
        <ul>
          <li>Principes fondamentaux du service client</li>
          <li>Communication efficace et empathique</li>
          <li>Gestion des situations difficiles</li>
          <li>Techniques de désescalade</li>
        </ul>
      `,
      'default': `
        <h3>${training.title}</h3>
        <p>Formation professionnelle de qualité conçue pour développer vos compétences.</p>
        <p>Cette formation comprend des modules théoriques et pratiques adaptés à votre niveau.</p>
      `
    };

    return contents[training.title] || contents['default'];
  };

  const getObjectives = (training: Training) => {
    const objectives: { [key: string]: string[] } = {
      'Formation Moov': [
        'Maîtriser les services et produits Moov',
        'Utiliser efficacement les outils d\'Intelligence Artificielle',
        'Développer des techniques de vente adaptées',
        'Améliorer la satisfaction client'
      ],
      'Service Client Excellence': [
        'Développer l\'excellence relationnelle',
        'Gérer les situations de conflit',
        'Améliorer la communication client',
        'Optimiser la satisfaction client'
      ],
      'default': [
        'Acquérir les compétences requises',
        'Appliquer les bonnes pratiques',
        'Améliorer ses performances',
        'Développer son expertise'
      ]
    };

    return objectives[training.title] || objectives['default'];
  };

  const getPrerequisites = (training: Training) => {
    if (training.level === 'beginner') return undefined;
    
    const prerequisites: { [key: string]: string[] } = {
      'Formation Moov': [
        'Connaissance de base des télécommunications',
        'Expérience en vente recommandée'
      ],
      'Service Client Excellence': [
        'Expérience en relation client',
        'Bases de la communication'
      ],
      'default': [
        'Formation de base requise',
        'Expérience professionnelle recommandée'
      ]
    };

    return prerequisites[training.title] || prerequisites['default'];
  };

  const getMaterials = (training: Training): ContentFile[] => {
    if (training.title === 'Formation Moov') {
      return [
        {
          id: 'mia-video',
          name: 'MIA.mp4',
          type: 'mp4',
          size: '125 MB',
          url: '/MoovCourse/MIA.mp4',
          author: 'Équipe Moov',
          uploadDate: '2024-01-15',
          downloads: 45,
          teamIds: [1],
          category: 'Video',
          duration: '15:30',
          description: 'Présentation de l\'Intelligence Artificielle Moov'
        },
        {
          id: 'argumentaire-voix',
          name: 'Argumentaire de Vente Voix',
          type: 'docx',
          size: '2.3 MB',
          url: '/MoovCourse/ARGUMENTAIRE DE VENTE VOIX.docx',
          author: 'Direction Commerciale',
          uploadDate: '2024-01-10',
          downloads: 78,
          teamIds: [1],
          category: 'Document',
          pages: 12,
          description: 'Guide complet pour la vente des services vocaux'
        },
        {
          id: 'guide-ia',
          name: 'Guide Intelligence Artificielle',
          type: 'pdf',
          size: '4.1 MB',
          url: '/MoovCourse/Moov Intelligence Artificielle.pdf',
          author: 'Équipe Technique',
          uploadDate: '2024-01-08',
          downloads: 156,
          teamIds: [1],
          category: 'Guide',
          pages: 28,
          description: 'Documentation technique de l\'IA Moov'
        }
      ];
    }

    return [];
  };

  const goToPrevious = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="relative">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Formation {currentSlide + 1} sur {trainings.length}
          </h2>
          <p className="text-gray-600">Naviguez avec les flèches ou en glissant</p>
        </div>
        
        {/* Custom Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={currentSlide === 0}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={currentSlide === trainings.length - 1}
            className="h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Swiper Component */}
      <Swiper
        modules={[Navigation, Pagination, Keyboard, Mousewheel]}
        spaceBetween={30}
        slidesPerView={1}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex);
        }}
        breakpoints={{
          768: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 1.3,
            spaceBetween: 30,
          },
        }}
        className="formation-swiper pb-12"
      >
        {trainings.map((training) => (
          <SwiperSlide key={training.id}>
            <Card className="hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                  {/* Course Image */}
                  <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-12 w-12 text-blue-600" />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{training.title}</h3>
                        <p className="text-gray-600 mb-2">Par {training.instructor}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {training.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {training.studentsCount} employés
                          </span>
                           <div className="flex items-center gap-1">
                             <StarRatingDisplay 
                               rating={getModuleRating(training.title).averageRating || training.rating}
                               size="sm" 
                               showValue={false}
                             />
                             <span className="text-xs text-gray-500">
                               ({getModuleRating(training.title).ratingCount || 0})
                             </span>
                           </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(training.status)}>
                          {training.status}
                        </Badge>
                        <Badge variant="outline">{training.level}</Badge>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {training.status !== "Non commencée" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">
                            {training.completedLessons}/{training.totalLessons} leçons • {training.progress}%
                          </span>
                        </div>
                        <Progress value={training.progress} className="h-2" />
                      </div>
                    )}

                    {/* Next Steps */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm">
                        {training.status === "Terminée" ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Terminée {training.completedDate}</span>
                            {training.certificate && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Award className="h-3 w-3 mr-1" />
                                Certificat
                              </Badge>
                            )}
                          </div>
                        ) : training.status === "En cours" ? (
                          <div>
                            <p className="text-gray-600">
                              Prochaine leçon: <span className="font-medium">{training.nextLesson}</span>
                            </p>
                            <p className="text-gray-500">
                              Temps estimé pour terminer: {training.estimatedCompletion}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600">
                              Commencer par: <span className="font-medium">{training.nextLesson}</span>
                            </p>
                            <p className="text-gray-500">
                              Temps estimé: {training.estimatedCompletion}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReadMore(training)}>
                          <Info className="h-4 w-4 mr-2" />
                          Lire Plus
                        </Button>
                        {training.status === "Terminée" ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleReviewCourse(training)}>
                              Revoir
                            </Button>
                            {training.certificate && (
                              <Button size="sm" onClick={() => handleDownloadCertificate(training.title)}>
                                <Award className="h-4 w-4 mr-2" />
                                Certificat
                              </Button>
                            )}
                          </>
                        ) : training.status === "En cours" ? (
                          <Button size="sm" onClick={() => handleContinueCourse(training)}>
                            <Play className="h-4 w-4 mr-2" />
                            Continuer
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleStartCourse(training)}>
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <div className="flex gap-2">
          {trainings.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-4">
          {currentSlide + 1} / {trainings.length}
        </span>
      </div>

      {/* Keyboard Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Utilisez les flèches ← → ou glissez pour naviguer • Molette souris supportée</p>
      </div>

      {/* Formation Info Modal */}
      <FormationInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFormation(null);
        }}
        formation={selectedFormation}
      />
    </div>
  );
};

export default FormationSwiper;