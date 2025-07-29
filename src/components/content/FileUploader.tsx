import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  Music,
  File,
  CheckCircle
} from 'lucide-react';
import { ContentFile, Team } from '@/types/content';
import { useAuth } from '@/hooks/useAuthCompatibility';

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: ContentFile[]) => void;
  teams: Team[];
}

interface UploadFile {
  id: string;
  file: File;
  name: string;
  type: ContentFile['type'];
  size: string;
  description: string;
  category: string;
  selectedTeams: number[];
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

const FileUploader = ({ isOpen, onClose, onUpload, teams }: FileUploaderProps) => {
  const { user, hasPermission } = useAuth();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-6 w-6 text-red-500" />;
    if (type.startsWith('audio/')) return <Music className="h-6 w-6 text-green-500" />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) 
      return <FileText className="h-6 w-6 text-orange-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const getFileType = (file: File): ContentFile['type'] => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: { [key: string]: ContentFile['type'] } = {
      'pdf': 'pdf',
      'docx': 'docx',
      'doc': 'docx',
      'pptx': 'pptx',
      'ppt': 'pptx',
      'mp4': 'mp4',
      'avi': 'mp4',
      'mov': 'mp4',
      'mp3': 'mp3',
      'wav': 'mp3',
      'jpg': 'jpg',
      'jpeg': 'jpg',
      'png': 'png',
      'txt': 'txt'
    };
    return typeMap[extension] || 'txt';
  };

  const handleFileInput = useCallback((selectedFiles: FileList) => {
    const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      type: getFileType(file),
      size: formatFileSize(file.size),
      description: '',
      category: 'formation',
      selectedTeams: user?.teamId ? [user.teamId] : [],
      uploading: false,
      uploaded: false
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [user?.teamId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileInput(droppedFiles);
    }
  }, [handleFileInput]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const toggleTeamSelection = (fileId: string, teamId: number) => {
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const selectedTeams = file.selectedTeams.includes(teamId)
          ? file.selectedTeams.filter(id => id !== teamId)
          : [...file.selectedTeams, teamId];
        return { ...file, selectedTeams };
      }
      return file;
    }));
  };

  const uploadFiles = async () => {
    if (!hasPermission('upload_files') && !hasPermission('manage_files')) {
      return;
    }

    const filesToUpload = files.filter(f => !f.uploaded);
    
    for (const file of filesToUpload) {
      updateFile(file.id, { uploading: true, error: undefined });
      
      try {
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateFile(file.id, { uploading: false, uploaded: true });
      } catch (error) {
        updateFile(file.id, { 
          uploading: false, 
          error: 'Erreur lors du téléchargement' 
        });
      }
    }

    // Convert to ContentFile format
    const uploadedFiles: ContentFile[] = files
      .filter(f => f.uploaded)
      .map(f => ({
        id: f.id,
        name: f.name,
        type: f.type as ContentFile['type'],
        size: f.size,
        url: `#${f.id}`,
        author: user?.name || 'Utilisateur',
        uploadDate: new Date().toISOString(),
        downloads: 0,
        teamIds: f.selectedTeams,
        category: f.category,
        description: f.description
      }));

    onUpload(uploadedFiles);
  };

  const canUpload = hasPermission('upload_files') || hasPermission('manage_files');
  const hasValidFiles = files.some(f => !f.uploaded && f.selectedTeams.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Télécharger des Fichiers</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <Input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileInput(e.target.files)}
              className="hidden"
              id="file-input"
              accept=".pdf,.docx,.doc,.pptx,.ppt,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.txt"
            />
            <Label htmlFor="file-input">
              <Button variant="outline" asChild>
                <span>Sélectionner des fichiers</span>
              </Button>
            </Label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fichiers sélectionnés ({files.length})</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file) => (
                  <Card key={file.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {getFileIcon(file.file.type)}
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{file.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                                <span>{file.size}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {file.uploaded && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {file.uploading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                disabled={file.uploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {!file.uploaded && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`description-${file.id}`}>Description</Label>
                                  <Textarea
                                    id={`description-${file.id}`}
                                    value={file.description}
                                    onChange={(e) => updateFile(file.id, { description: e.target.value })}
                                    placeholder="Description du fichier..."
                                    className="mt-1"
                                    rows={2}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`category-${file.id}`}>Catégorie</Label>
                                  <Select 
                                    value={file.category} 
                                    onValueChange={(value) => updateFile(file.id, { category: value })}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="formation">Formation</SelectItem>
                                      <SelectItem value="documentation">Documentation</SelectItem>
                                      <SelectItem value="ressources">Ressources</SelectItem>
                                      <SelectItem value="evaluation">Évaluation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Équipes autorisées</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                  {teams.map((team) => (
                                    <div key={team.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`team-${file.id}-${team.id}`}
                                        checked={file.selectedTeams.includes(team.id)}
                                        onCheckedChange={() => toggleTeamSelection(file.id, team.id)}
                                      />
                                      <Label 
                                        htmlFor={`team-${file.id}-${team.id}`}
                                        className="text-sm"
                                      >
                                        {team.name}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                          
                          {file.error && (
                            <p className="text-sm text-red-600">{file.error}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            {files.filter(f => f.uploaded).length} fichier(s) téléchargé(s) sur {files.length}
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={uploadFiles}
              disabled={!canUpload || !hasValidFiles || files.every(f => f.uploaded)}
            >
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;