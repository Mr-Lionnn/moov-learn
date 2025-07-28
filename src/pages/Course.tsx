
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";
import { testDataService } from "@/services/testDataService";

const Course = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    // Load course data based on courseId
    const testCourses = testDataService.getTestCourses();
    console.log('🔍 Course.tsx - Received courseId:', courseId);
    console.log('🔍 Available courses:', testCourses.map(c => ({ id: c.id, title: c.title })));
    
    const selectedCourse = courseId 
      ? testCourses.find(c => c.id === courseId || c.id === courseId.toString())
      : null;
    
    if (!selectedCourse) {
      console.error('❌ Course not found for ID:', courseId, 'Available courses:', testCourses.map(c => c.id));
      // Instead of redirecting immediately, let's show an error state
      setCourse(null);
      setLessons([]);
      return;
    }
    
    console.log('✅ Found course:', courseId, selectedCourse);
    setCourse(selectedCourse);
    
    // Generate realistic lessons based on course content
    const courseLessons = generateLessonsForCourse(selectedCourse);
    console.log('🔥 Generated lessons for', selectedCourse.id, ':', courseLessons);
    setLessons(courseLessons);
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
        { id: 1, title: "Qu'est-ce que le Leadership?", duration: "35:00", completed: false, type: "video" },
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
      console.log('⚠️ No lessons found for course:', course.id, 'falling back to customer-service-excellence');
    }
    return lessons || lessonSets['customer-service-excellence'];
  };

  const handleCourseComplete = () => {
    console.log("Course completed!");
    // Update progress in test data
    navigate("/");
  };

  if (!course) {
    return (
      <div className="min-h-screen moov-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Formation non trouvée</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Retour au Tableau de Bord
          </Button>
        </div>
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

        <CoursePlayer
          courseTitle={course.title}
          currentLesson={currentLesson}
          lessons={lessons}
          onCourseComplete={handleCourseComplete}
        />
      </main>
    </div>
  );
};

export default Course;
