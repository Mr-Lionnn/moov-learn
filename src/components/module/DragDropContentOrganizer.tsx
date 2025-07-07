import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GripVertical, 
  FileText, 
  Video, 
  Headphones, 
  HelpCircle,
  Image,
  FileIcon,
  Trash2,
  Edit3,
  Plus
} from "lucide-react";
import { ModuleContent, ModuleSection } from "@/types/module";

interface ContentItemProps {
  content: ModuleContent;
  onEdit: (content: ModuleContent) => void;
  onDelete: (contentId: string) => void;
}

const ContentItem = ({ content, onEdit, onDelete }: ContentItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'document': return <FileIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-orange-100 text-orange-800';
      case 'image': return 'bg-pink-100 text-pink-800';
      case 'document': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <Card className="cursor-move hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 text-gray-600">
              {getIcon(content.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{content.title}</h4>
                <Badge className={`text-xs ${getTypeColor(content.type)}`}>
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {content.duration && (
                  <span>Durée: {formatDuration(content.duration)}</span>
                )}
                {content.fileName && (
                  <span>Fichier: {content.fileName}</span>
                )}
                {content.fileSize && (
                  <span>Taille: {(content.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(content)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(content.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SectionProps {
  section: ModuleSection;
  onContentReorder: (sectionId: string, newContents: ModuleContent[]) => void;
  onContentEdit: (content: ModuleContent) => void;
  onContentDelete: (sectionId: string, contentId: string) => void;
  onAddContent: (sectionId: string) => void;
}

const SectionComponent = ({ 
  section, 
  onContentReorder, 
  onContentEdit, 
  onContentDelete,
  onAddContent 
}: SectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.contents.findIndex(item => item.id === active.id);
      const newIndex = section.contents.findIndex(item => item.id === over.id);
      
      const newContents = arrayMove(section.contents, oldIndex, newIndex);
      onContentReorder(section.id, newContents);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{section.title}</CardTitle>
            {section.description && (
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddContent(section.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter du Contenu
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={section.contents.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.contents.map((content) => (
              <ContentItem
                key={content.id}
                content={content}
                onEdit={onContentEdit}
                onDelete={(contentId) => onContentDelete(section.id, contentId)}
              />
            ))}
          </SortableContext>
        </DndContext>
        
        {section.contents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun contenu dans cette section</p>
            <p className="text-xs">Glissez-déposez du contenu ou utilisez le bouton d'ajout</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DragDropContentOrganizerProps {
  sections: ModuleSection[];
  onSectionReorder: (newSections: ModuleSection[]) => void;
  onContentReorder: (sectionId: string, newContents: ModuleContent[]) => void;
  onContentEdit: (content: ModuleContent) => void;
  onContentDelete: (sectionId: string, contentId: string) => void;
  onAddContent: (sectionId: string) => void;
}

const DragDropContentOrganizer = ({
  sections,
  onSectionReorder,
  onContentReorder,
  onContentEdit,
  onContentDelete,
  onAddContent
}: DragDropContentOrganizerProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      onSectionReorder(newSections);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Organisation du Contenu</h3>
        <div className="text-sm text-gray-600">
          {sections.length} section{sections.length > 1 ? 's' : ''} • {' '}
          {sections.reduce((total, section) => total + section.contents.length, 0)} élément{sections.reduce((total, section) => total + section.contents.length, 0) > 1 ? 's' : ''}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext 
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionComponent
                key={section.id}
                section={section}
                onContentReorder={onContentReorder}
                onContentEdit={onContentEdit}
                onContentDelete={onContentDelete}
                onAddContent={onAddContent}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Aucune section créée</h4>
            <p className="text-sm text-gray-500">Commencez par ajouter une section à votre module</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DragDropContentOrganizer;