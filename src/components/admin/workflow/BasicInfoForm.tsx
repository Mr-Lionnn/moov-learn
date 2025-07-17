import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { CourseData } from "../CourseCreationWorkflow";
import { useState } from "react";

interface BasicInfoFormProps {
  courseData: CourseData;
  onUpdate: (data: CourseData) => void;
}

const BasicInfoForm = ({ courseData, onUpdate }: BasicInfoFormProps) => {
  const [newObjective, setNewObjective] = useState("");
  const [newAudience, setNewAudience] = useState("");

  const updateField = (field: keyof CourseData, value: any) => {
    onUpdate({ ...courseData, [field]: value });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      updateField('learningObjectives', [...courseData.learningObjectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    updateField('learningObjectives', courseData.learningObjectives.filter((_, i) => i !== index));
  };

  const addAudience = () => {
    if (newAudience.trim()) {
      updateField('targetAudience', [...courseData.targetAudience, newAudience.trim()]);
      setNewAudience("");
    }
  };

  const removeAudience = (index: number) => {
    updateField('targetAudience', courseData.targetAudience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Basic Course Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la Formation *</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ex: Maîtrise des outils numériques"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Durée Estimée *</Label>
          <Input
            id="duration"
            value={courseData.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="Ex: 4 heures"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description de la Formation *</Label>
        <Textarea
          id="description"
          value={courseData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Décrivez les objectifs et le contenu de cette formation..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Niveau de Difficulté</Label>
          <Select 
            value={courseData.level} 
            onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => updateField('level', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Catégorie</Label>
          <Select 
            value={courseData.category} 
            onValueChange={(value) => updateField('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technologie">Technologie</SelectItem>
              <SelectItem value="management">Management</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="securite">Sécurité</SelectItem>
              <SelectItem value="qualite">Qualité</SelectItem>
              <SelectItem value="langues">Langues</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="space-y-4">
        <Label>Objectifs d'Apprentissage</Label>
        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Ajouter un objectif d'apprentissage..."
            onKeyDown={(e) => e.key === 'Enter' && addObjective()}
          />
          <Button type="button" onClick={addObjective} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {courseData.learningObjectives.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {courseData.learningObjectives.map((objective, index) => (
              <Badge key={index} variant="secondary" className="pr-1">
                {objective}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 ml-2"
                  onClick={() => removeObjective(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <Label>Public Cible</Label>
        <div className="flex gap-2">
          <Input
            value={newAudience}
            onChange={(e) => setNewAudience(e.target.value)}
            placeholder="Ajouter un groupe cible..."
            onKeyDown={(e) => e.key === 'Enter' && addAudience()}
          />
          <Button type="button" onClick={addAudience} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {courseData.targetAudience.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {courseData.targetAudience.map((audience, index) => (
              <Badge key={index} variant="secondary" className="pr-1">
                {audience}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 ml-2"
                  onClick={() => removeAudience(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;