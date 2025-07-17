import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Upload, BookOpen, AlertTriangle } from "lucide-react";
import { NewCourse } from "@/types/admin";

interface CourseCreationTabProps {
  newCourse: NewCourse;
  setNewCourse: (course: NewCourse) => void;
  onCreateCourse: () => void;
  onShowModuleCreator: () => void;
  canUploadContent: boolean;
}

const CourseCreationTab = ({ 
  newCourse, 
  setNewCourse, 
  onCreateCourse, 
  onShowModuleCreator,
  canUploadContent 
}: CourseCreationTabProps) => {
  return (
    <div className="space-y-6">
      {!canUploadContent && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Accès restreint: Seuls les Administrateurs, Chefs d'équipe et Responsables peuvent créer du contenu.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className={!canUploadContent ? "opacity-50 pointer-events-none" : ""}>
        <CardHeader>
          <CardTitle>Créer un Nouveau Cours</CardTitle>
          <CardDescription>
            Ajoutez un nouveau cours avec évaluation obligatoire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du Cours</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                placeholder="Ex: Introduction au JavaScript"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructeur</Label>
              <Input
                id="instructor"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                placeholder="Nom de l'instructeur"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              placeholder="Description détaillée du cours..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                placeholder="Ex: 10 heures"
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select onValueChange={(value) => setNewCourse({...newCourse, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technologie">Technologie</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="langues">Langues</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select onValueChange={(value) => setNewCourse({...newCourse, level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requires-quiz"
              checked={newCourse.requiresQuiz}
              onChange={(e) => setNewCourse({...newCourse, requiresQuiz: e.target.checked})}
              className="rounded border-gray-300"
            />
            <Label htmlFor="requires-quiz" className="text-sm">
              Quiz obligatoire pour terminer ce cours
            </Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={onCreateCourse} className="flex-1" disabled={!canUploadContent}>
              <Save className="h-4 w-4 mr-2" />
              Créer le Cours
            </Button>
            <Button 
              onClick={onShowModuleCreator} 
              className="flex-1 moov-gradient text-white" 
              disabled={!canUploadContent}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Module Avancé
            </Button>
            <Button 
              variant="outline" 
              disabled={!canUploadContent}
              onClick={() => {
                // This will be handled by the new workflow
                alert("Utilisez le nouveau workflow 'Créer une Formation' pour télécharger du contenu avec l'interface améliorée !");
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Télécharger du Contenu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCreationTab;