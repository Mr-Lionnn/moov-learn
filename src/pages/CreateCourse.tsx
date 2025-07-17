import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import CourseCreationWorkflow, { CourseData } from "@/components/admin/CourseCreationWorkflow";
import { Team } from "@/types/content";

const CreateCourse = () => {
  const navigate = useNavigate();

  const handleCourseSave = (courseData: CourseData) => {
    console.log("Course workflow saved:", courseData);
    
    // Save to localStorage
    try {
      const existingCourses = JSON.parse(localStorage.getItem('moov_test_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('moov_test_courses', JSON.stringify(existingCourses));
      
      console.log('✅ Course saved successfully:', courseData);
      // Navigate to confirmation page with course data
      navigate('/course-completion', { state: { courseData } });
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erreur lors de la création de la formation');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Mock teams data for the workflow
  const mockTeams: Team[] = [
    { id: 1, name: "Équipe Développement", memberCount: 8, description: "Équipe de développement", leaderId: 1, createdAt: new Date().toISOString() },
    { id: 2, name: "Équipe Marketing", memberCount: 5, description: "Équipe marketing", leaderId: 2, createdAt: new Date().toISOString() },
    { id: 3, name: "Équipe Support", memberCount: 6, description: "Équipe support", leaderId: 3, createdAt: new Date().toISOString() },
    { id: 4, name: "Équipe Direction", memberCount: 3, description: "Direction", leaderId: 4, createdAt: new Date().toISOString() }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au Tableau de Bord
            </Button>
            
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Création de Formation</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseCreationWorkflow
          onSave={handleCourseSave}
          onCancel={handleCancel}
          teams={mockTeams}
        />
      </div>
    </div>
  );
};

export default CreateCourse;