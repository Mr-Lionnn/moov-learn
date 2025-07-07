
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText } from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    size: string;
    type: string;
    author: string;
    downloads: number;
    date: string;
  };
}

const FileViewerModal = ({ isOpen, onClose, file }: FileViewerModalProps) => {
  const handleDownload = () => {
    // Create a more realistic file download
    const fileContent = generateSampleFileContent(file.name, file.type);
    const blob = new Blob([fileContent], { type: getContentType(file.type) });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    console.log(`Downloaded file: ${file.name}`);
  };

  const handleView = () => {
    // Create preview content and open in new tab
    const fileContent = generateSampleFileContent(file.name, file.type);
    const blob = new Blob([fileContent], { type: getContentType(file.type) });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    console.log(`Viewing file: ${file.name}`);
  };

  const generateSampleFileContent = (fileName: string, fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return `Sample PDF content for ${fileName}\n\nThis would be a PDF document with course materials, exercises, and reference information.`;
      case 'doc':
      case 'docx':
        return `Sample Document: ${fileName}\n\nCourse Materials and Notes\n\n1. Introduction\n2. Key Concepts\n3. Practical Examples\n4. Exercises`;
      case 'txt':
        return `Text Document: ${fileName}\n\nThis is sample text content that would contain course notes, instructions, or reference materials.`;
      default:
        return `Sample content for ${fileName}\n\nThis file contains educational materials related to your course.`;
    }
  };

  const getContentType = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt': return 'text/plain';
      default: return 'text/plain';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {file.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Taille:</span>
              <p className="font-medium">{file.size}</p>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <Badge variant="outline">{file.type}</Badge>
            </div>
            <div>
              <span className="text-gray-600">Auteur:</span>
              <p className="font-medium">{file.author}</p>
            </div>
            <div>
              <span className="text-gray-600">Téléchargements:</span>
              <p className="font-medium">{file.downloads}</p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span>Date de création: {file.date}</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleView} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewerModal;
