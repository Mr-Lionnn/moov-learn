
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
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = file.name;
    link.click();
    console.log(`Downloading file: ${file.name}`);
  };

  const handleView = () => {
    // Simulate file viewing in new tab
    window.open('#', '_blank');
    console.log(`Viewing file: ${file.name}`);
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
