import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Bookmark, Image, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/enhanced/DocumentViewer";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import RoleBasedAccess from "@/components/enhanced/RoleBasedAccess";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  description?: string;
  author: string;
  downloads: number;
  date: string;
  category?: string;
}

interface DocumentSectionProps {
  documents: Document[];
  courseTitle?: string;
  lessonTitle?: string;
}

const DocumentSection = ({ documents, courseTitle, lessonTitle }: DocumentSectionProps) => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { saveDocument, downloadDocument, viewDocument } = useDocumentManager();

  const handleSaveDocument = (document: Document) => {
    const moduleId = courseTitle ? `${courseTitle}-${lessonTitle}` : "general";
    saveDocument(document, moduleId);
  };

  const handleDownload = (document: Document) => {
    downloadDocument(document);
  };

  const handleViewDocument = (document: Document) => {
    if (viewDocument(document)) {
      setSelectedDocument(document);
    }
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
      <>
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
                <Card key={document.id || index} className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(document.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{document.name}</p>
                        <p className="text-sm text-gray-600">{document.size}</p>
                        {document.description && (
                          <p className="text-sm text-gray-500 truncate">{document.description}</p>
                        )}
                        {document.author && (
                          <p className="text-xs text-gray-500">Par: {document.author}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <RoleBasedAccess requiredPermissions={['view_files']}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="hover-scale w-full sm:w-auto"
                          title="Voir le document"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-2">Voir</span>
                        </Button>
                      </RoleBasedAccess>
                      <RoleBasedAccess requiredPermissions={['view_files']}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSaveDocument(document)}
                          className="hover-scale w-full sm:w-auto"
                          title="Sauvegarder le document"
                        >
                          <Bookmark className="h-4 w-4" />
                          <span className="ml-2">Sauvegarder</span>
                        </Button>
                      </RoleBasedAccess>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Document Viewer */}
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          file={selectedDocument}
          onSave={handleSaveDocument}
          onDownload={handleDownload}
        />
      </>
    );
};

export default DocumentSection;