import UniversalDocumentViewer from '@/components/viewers/UniversalDocumentViewer';
import { ContentFile } from '@/types/content';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: ContentFile | null;
  onSave?: (file: ContentFile) => void;
  onDownload?: (file: ContentFile) => void;
}

const DocumentViewer = ({ isOpen, onClose, file, onSave, onDownload }: DocumentViewerProps) => {
  return (
    <UniversalDocumentViewer
      isOpen={isOpen}
      onClose={onClose}
      file={file}
      onSave={onSave}
      onDownload={onDownload}
    />
  );
};

export default DocumentViewer;