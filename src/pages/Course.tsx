
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";
import InlineContentViewer from "@/components/InlineContentViewer";
import { testDataService } from "@/services/testDataService";
import { ContentFile } from "@/types/content";

const Course = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [showInlineViewer, setShowInlineViewer] = useState(false);

  useEffect(() => {
    // Load course data based on courseId or default to first course
    const testCourses = testDataService.getTestCourses();
    console.log('🔥 Course component - courseId from URL:', courseId);
    console.log('🔥 Available courses:', testCourses.map(c => ({ id: c.id, title: c.title })));
    
    const selectedCourse = courseId 
      ? testCourses.find(c => c.id === courseId)
      : null; // Don't default to first course - this was causing the issue!
    
    if (selectedCourse) {
      console.log('🔥 Loading course:', courseId, selectedCourse);
      setCourse(selectedCourse);
      
      // Generate realistic lessons based on course content
      const courseLessons = generateLessonsForCourse(selectedCourse);
      console.log('🔥 Generated lessons for', selectedCourse.id, ':', courseLessons);
      setLessons(courseLessons);
      
      // Generate content files for inline viewing
      const courseContentFiles = generateContentFiles(selectedCourse);
      setContentFiles(courseContentFiles);
      
      // Enable inline viewer for Formation Moov
      setShowInlineViewer(selectedCourse.id === 'formation-moov');
    } else {
      console.error('❌ Course not found for ID:', courseId);
      console.log('Available course IDs:', testCourses.map(c => c.id));
      setCourse(null);
      setLessons([]);
    }
  }, [courseId]);

  const generateLessonsForCourse = (course: any) => {
    const lessonSets: { [key: string]: any[] } = {
      'customer-service-excellence': [
        { id: 1, title: "Introduction au Service Client", duration: "15:30", completed: true, type: "video" },
        { id: 2, title: "Communication Efficace", duration: "20:45", completed: true, type: "text" },
        { id: 3, title: "Gestion des Situations Difficiles", duration: "25:15", completed: false, type: "video" },
        { id: 4, title: "Techniques de Désescalade", duration: "18:20", completed: false, type: "audio" },
        { id: 5, title: "Quiz d'Évaluation", duration: "15:00", completed: false, type: "quiz" }
      ],
      'gdpr-compliance': [
        { id: 1, title: "Principes Fondamentaux du RGPD", duration: "22:30", completed: true, type: "text" },
        { id: 2, title: "Droits des Personnes Concernées", duration: "18:45", completed: true, type: "text" },
        { id: 3, title: "Violations de Données", duration: "20:15", completed: false, type: "video" },
        { id: 4, title: "Mise en Conformité Pratique", duration: "25:30", completed: false, type: "text" },
        { id: 5, title: "Évaluation RGPD", duration: "20:00", completed: false, type: "quiz" }
      ],
      'advanced-sales-techniques': [
        { id: 1, title: "Vente Consultative", duration: "30:00", completed: true, type: "video" },
        { id: 2, title: "Identification des Besoins Client", duration: "25:45", completed: true, type: "video" },
        { id: 3, title: "Gestion des Objections", duration: "28:30", completed: false, type: "video" },
        { id: 4, title: "Techniques de Closing", duration: "22:15", completed: false, type: "video" },
        { id: 5, title: "Suivi et Fidélisation", duration: "20:00", completed: false, type: "audio" },
        { id: 6, title: "Évaluation Finale", duration: "25:00", completed: false, type: "quiz" }
      ],
      'leadership-fundamentals': [
        { id: 1, title: "Fondamentaux du Leadership", duration: "35:00", completed: false, type: "video" },
        { id: 2, title: "Styles de Management", duration: "40:30", completed: false, type: "text" },
        { id: 3, title: "Motivation d'Équipe", duration: "30:45", completed: false, type: "video" },
        { id: 4, title: "Gestion des Conflits", duration: "45:20", completed: false, type: "video" },
        { id: 5, title: "Feedback et Coaching", duration: "35:15", completed: false, type: "audio" },
        { id: 6, title: "Évaluation Leadership", duration: "30:00", completed: false, type: "quiz" }
      ],
      'formation-moov': [
        { id: 1, title: "Vidéo Intelligence Artificielle Moov", duration: "15:30", completed: false, type: "video", 
          fileName: "MIA.mp4", fileType: "mp4" },
        { id: 2, title: "Argumentaire de Vente Voix", duration: "25:00", completed: false, type: "document", 
          fileName: "ARGUMENTAIRE DE VENTE VOIX.docx", fileType: "docx" },
        { id: 3, title: "Argumentaire Commerciaux Front Office", duration: "20:00", completed: false, type: "document", 
          fileName: "Argumentaire de vente commerciaux front office (AgenceMoovshops).docx", fileType: "docx" },
        { id: 4, title: "Guide Intelligence Artificielle", duration: "30:00", completed: false, type: "document", 
          fileName: "Moov Intelligence Artificielle.pdf", fileType: "pdf" },
        { id: 5, title: "Présentation Services SVA", duration: "25:00", completed: false, type: "document", 
          fileName: "PRESENTATION SVA.pdf", fileType: "pdf" },
        { id: 6, title: "Services Voix SMS Data", duration: "35:00", completed: false, type: "document", 
          fileName: "SERVICE VOIX SMS DATA.pptx", fileType: "pptx" },
        { id: 7, title: "Quiz Mensuel Formation Moov", duration: "30:00", completed: false, type: "quiz" }
      ]
    };

    console.log('🔥 Looking for lessons for course ID:', course.id, 'Available lesson sets:', Object.keys(lessonSets));
    const lessons = lessonSets[course.id];
    if (!lessons) {
      console.log('⚠️ No lessons found for course:', course.id);
      console.log('⚠️ This will result in no content being displayed!');
      // Don't return fallback - let the component handle the missing lessons gracefully
      return [];
    }
    return lessons;
  };

  const generateContentFiles = (course: any): ContentFile[] => {
    if (course.id === 'formation-moov') {
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
          name: 'Argumentaire de Vente Voix.docx',
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
          id: 'argumentaire-front-office',
          name: 'Argumentaire Commerciaux Front Office.docx',
          type: 'docx',
          size: '1.8 MB',
          url: '/MoovCourse/Argumentaire de vente commerciaux front office (AgenceMoovshops).docx',
          author: 'Équipe Commerciale',
          uploadDate: '2024-01-12',
          downloads: 62,
          teamIds: [1],
          category: 'Document',
          pages: 8,
          description: 'Techniques de vente pour les commerciaux en agence'
        },
        {
          id: 'guide-ia',
          name: 'Guide Intelligence Artificielle.pdf',
          type: 'pdf',
          size: '4.1 MB',
          url: '/MoovCourse/Moov Intelligence Artificielle.pdf',
          author: 'Équipe Technique',
          uploadDate: '2024-01-08',
          downloads: 156,
          teamIds: [1],
          category: 'Guide',
          pages: 28,
          description: 'Documentation technique complète de l\'IA Moov'
        },
        {
          id: 'presentation-sva',
          name: 'Présentation SVA.pdf',
          type: 'pdf',
          size: '3.2 MB',
          url: '/MoovCourse/PRESENTATION SVA.pdf',
          author: 'Direction Produits',
          uploadDate: '2024-01-11',
          downloads: 89,
          teamIds: [1],
          category: 'Présentation',
          pages: 15,
          description: 'Services à Valeur Ajoutée - Guide complet'
        },
        {
          id: 'services-voix-sms-data',
          name: 'Services Voix SMS Data.pptx',
          type: 'pptx',
          size: '8.7 MB',
          url: '/MoovCourse/SERVICE VOIX SMS DATA.pptx',
          author: 'Équipe Marketing',
          uploadDate: '2024-01-09',
          downloads: 134,
          teamIds: [1],
          category: 'Présentation',
          pages: 45,
          description: 'Présentation complète de tous les services Moov'
        }
      ];
    }

    return [];
  };

  const handleCourseComplete = () => {
    console.log("Course completed!");
    // Update progress in test data
    navigate("/");
  };

  if (!course && !courseId) {
    return (
      <div className="min-h-screen moov-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!course && courseId) {
    return (
      <div className="min-h-screen moov-gradient-subtle">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Formation non trouvée</h1>
            <p className="text-gray-600 mb-4">
              Le cours avec l'ID "{courseId}" n'existe pas.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen moov-gradient-subtle">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Formation non trouvée</h1>
            <p className="text-gray-600 mb-4">
              Le contenu de cette formation n'est pas disponible pour le moment.
            </p>
            <p className="text-sm text-gray-500">ID de cours: {courseId}</p>
          </div>
        </main>
      </div>
    );
  }

  const currentLesson = lessons.find(l => l.id === 1) || lessons[0];

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          
          {/* Display Formation Title */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 text-lg">{course.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-500">Durée: {course.duration}</span>
              <span className="text-sm text-gray-500">Niveau: {course.level === 'beginner' ? 'Débutant' : course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}</span>
              <span className="text-sm text-gray-500">Catégorie: {course.category}</span>
            </div>
          </div>
        </div>

        {/* Content Display - Use inline viewer for Formation Moov, regular player for others */}
        {showInlineViewer && contentFiles.length > 0 ? (
          <InlineContentViewer
            contentFiles={contentFiles}
            title={course.title}
            description={course.description}
            onComplete={() => {
              console.log('Formation completed!');
              navigate("/");
            }}
          />
        ) : (
          <CoursePlayer
            courseTitle={course.title}
            currentLesson={currentLesson}
            lessons={lessons}
            onCourseComplete={handleCourseComplete}
          />
        )}
      </main>
    </div>
  );
};

export default Course;
