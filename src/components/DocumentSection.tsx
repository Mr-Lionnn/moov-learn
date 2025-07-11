import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Bookmark, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  name: string;
  type: string;
  size: string;
  description?: string;
}

interface DocumentSectionProps {
  documents: Document[];
  courseTitle?: string;
  lessonTitle?: string;
}

const DocumentSection = ({ documents, courseTitle, lessonTitle }: DocumentSectionProps) => {
  const { toast } = useToast();

  const handleSaveDocument = (document: Document) => {
    const savedDocument = {
      ...document,
      courseTitle,
      lessonTitle,
      savedAt: new Date().toISOString(),
    };
    
    console.log("Saving document:", savedDocument);
    
    toast({
      title: "Document sauvegardé",
      description: `${document.name} a été ajouté à vos fichiers`,
    });
  };

  const handleDownload = (fileName: string) => {
    console.log(`Téléchargement de ${fileName}`);
    toast({
      title: "Téléchargement démarré",
      description: `${fileName} est en cours de téléchargement`,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "video":
      case "mp4":
        return <Video className="h-5 w-5 text-blue-600" />;
      case "image":
      case "jpg":
      case "png":
        return <Image className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents et Ressources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document, index) => (
            <Card key={index} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(document.type)}
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-gray-600">{document.size}</p>
                    {document.description && (
                      <p className="text-sm text-gray-500">{document.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSaveDocument(document)}
                    className="hover-scale"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(document.name)}
                    className="hover-scale"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentSection;