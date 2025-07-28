import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/content/DocumentViewer";
import { ContentFile } from "@/types/content";

interface MoovDocumentContentProps {
  title: string;
  fileName: string;
  fileType: string;
  duration?: string;
  onComplete: () => void;
}

const MoovDocumentContent = ({ 
  title, 
  fileName, 
  fileType, 
  duration,
  onComplete 
}: MoovDocumentContentProps) => {
  const { toast } = useToast();
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  // Create ContentFile object for DocumentViewer
  const documentFile: ContentFile = {
    id: `moov-${fileName}`,
    name: fileName,
    type: fileType.toLowerCase() as 'pdf' | 'pptx' | 'docx' | 'mp4' | 'mp3' | 'jpg' | 'png' | 'txt',
    size: "2.3 MB",
    url: `/MoovCourse/${fileName}`,
    author: "Formation Moov",
    uploadDate: new Date().toISOString(),
    downloads: 0,
    teamIds: [],
    category: "formation",
    description: title,
    duration: duration,
    pages: fileType.toLowerCase() === 'pdf' ? 15 : undefined
  };

  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-600" />;
      case "docx":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-600" />;
      case "mp4":
        return <Video className="h-8 w-8 text-purple-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "Document PDF";
      case "docx":
        return "Document Word";
      case "pptx":
        return "Présentation PowerPoint";
      case "mp4":
        return "Vidéo de Formation";
      default:
        return "Document";
    }
  };

  const handleViewDocument = () => {
    setIsDocumentViewerOpen(true);
    setIsViewed(true);
  };

  const handleComplete = () => {
    if (isViewed) {
      onComplete();
      toast({
        title: "Leçon terminée",
        description: `${title} a été marquée comme terminée.`,
      });
    } else {
      toast({
        title: "Document non consulté",
        description: "Veuillez d'abord consulter le document entièrement.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const downloadPath = `/MoovCourse/${fileName}`;
    const link = document.createElement('a');
    link.href = downloadPath;
    link.download = fileName;
    link.click();
    toast({
      title: "Téléchargement",
      description: `${fileName} téléchargé avec succès.`,
    });
  };

  const getFilePreview = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-red-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Aperçu du document PDF</p>
                <p className="text-xs text-gray-500 mt-2">Cliquez sur "Consulter" pour ouvrir</p>
              </div>
            </div>
          </div>
        );
      case "docx":
        return (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-blue-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Document Word</p>
                <p className="text-xs text-gray-500 mt-2">Argumentaires et guides pratiques</p>
              </div>
            </div>
          </div>
        );
      case "pptx":
        return (
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-orange-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Présentation PowerPoint</p>
                <p className="text-xs text-gray-500 mt-2">Supports de formation visuels</p>
              </div>
            </div>
          </div>
        );
      case "mp4":
        return (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center h-64 bg-black rounded relative overflow-hidden">
              <video 
                className="w-full h-full object-cover" 
                poster="/placeholder.svg"
                controls={false}
              >
                <source src={`/MoovCourse/${fileName}`} type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-sm">Vidéo de Formation MIA</p>
                  <p className="text-xs text-gray-300 mt-2">Intelligence Artificielle Moov</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{getFileTypeLabel()}</Badge>
                  {duration && <Badge variant="outline">{duration}</Badge>}
                  {isViewed && <Badge variant="default" className="bg-green-600">Consulté</Badge>}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Fichier:</strong> {fileName}</p>
              <p><strong>Type:</strong> {getFileTypeLabel()}</p>
              {duration && <p><strong>Durée estimée:</strong> {duration}</p>}
            </div>

            {getFilePreview()}

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleViewDocument}
                className="flex-1 sm:flex-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                Consulter le Document
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>

            {isViewed && (
              <Button
                onClick={handleComplete}
                className="w-full"
                size="lg"
              >
                Marquer comme Terminé
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={() => setIsDocumentViewerOpen(false)}
        file={documentFile}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default MoovDocumentContent;