import { useState, useCallback } from 'react';
import { useAuth } from "@/hooks/useAuthCompatibility";
import { useToast } from '@/hooks/use-toast';

interface DocumentFile {
  id: number;
  name: string;
  size: string;
  type: string;
  author: string;
  downloads: number;
  date: string;
  category?: string;
  url?: string;
  content?: string;
  moduleId?: string;
  savedAt?: string;
  userId?: number;
}

interface DocumentInteraction {
  action: 'view' | 'save' | 'download';
  documentId: number;
  timestamp: Date;
  userId: number;
}

export const useDocumentManager = () => {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [savedDocuments, setSavedDocuments] = useState<DocumentFile[]>([]);
  const [documentInteractions, setDocumentInteractions] = useState<DocumentInteraction[]>([]);

  // Load saved documents from localStorage
  const loadSavedDocuments = useCallback(() => {
    if (!user?.id) return [];
    
    try {
      const saved = localStorage.getItem(`saved_docs_${user.id}`);
      const docs = saved ? JSON.parse(saved) : [];
      setSavedDocuments(docs);
      return docs;
    } catch (error) {
      console.error('Error loading saved documents:', error);
      return [];
    }
  }, [user?.id]);

  // Save document to user's collection
  const saveDocument = useCallback((document: DocumentFile, moduleId?: string) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder des documents",
        variant: "destructive"
      });
      return false;
    }

    if (!hasPermission('view_files')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour sauvegarder des documents",
        variant: "destructive"
      });
      return false;
    }

    const savedDoc = {
      ...document,
      savedAt: new Date().toISOString(),
      moduleId: moduleId || "general",
      userId: user.id
    };

    const currentSaved = loadSavedDocuments();
    const isAlreadySaved = currentSaved.some(doc => doc.id === document.id);
    
    if (isAlreadySaved) {
      toast({
        title: "Information",
        description: "Ce document est déjà sauvegardé",
      });
      return false;
    }

    const updatedSaved = [...currentSaved, savedDoc];
    setSavedDocuments(updatedSaved);
    localStorage.setItem(`saved_docs_${user.id}`, JSON.stringify(updatedSaved));

    // Log the interaction
    logDocumentInteraction('save', document.id);

    toast({
      title: "Document sauvegardé",
      description: `${document.name} a été ajouté à vos documents sauvegardés`,
    });

    return true;
  }, [user, hasPermission, toast, loadSavedDocuments]);

  // Remove document from saved collection
  const removeSavedDocument = useCallback((documentId: number) => {
    if (!user?.id) return false;

    const currentSaved = loadSavedDocuments();
    const updatedSaved = currentSaved.filter(doc => doc.id !== documentId);
    setSavedDocuments(updatedSaved);
    localStorage.setItem(`saved_docs_${user.id}`, JSON.stringify(updatedSaved));

    toast({
      title: "Document retiré",
      description: "Le document a été retiré de vos documents sauvegardés",
    });

    return true;
  }, [user?.id, toast, loadSavedDocuments]);

  // Download document
  const downloadDocument = useCallback((document: DocumentFile) => {
    if (!hasPermission('download_files') && !hasPermission('view_files')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour télécharger des documents",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Generate mock file content based on type
      const fileContent = generateDocumentContent(document.name, document.type);
      const blob = new Blob([fileContent], { type: getContentType(document.type) });
      const link = window.document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = document.name;
      link.style.display = 'none';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // Log the interaction
      logDocumentInteraction('download', document.id);

      toast({
        title: "Téléchargement démarré",
        description: `${document.name} est en cours de téléchargement`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
      return false;
    }
  }, [hasPermission, toast]);

  // View document (log interaction)
  const viewDocument = useCallback((document: DocumentFile) => {
    if (!hasPermission('view_files')) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour voir ce document",
        variant: "destructive"
      });
      return false;
    }

    // Log the interaction
    logDocumentInteraction('view', document.id);
    return true;
  }, [hasPermission, toast]);

  // Log document interaction for analytics
  const logDocumentInteraction = useCallback((action: 'view' | 'save' | 'download', documentId: number) => {
    if (!user?.id) return;

    const interaction: DocumentInteraction = {
      action,
      documentId,
      timestamp: new Date(),
      userId: user.id
    };

    setDocumentInteractions(prev => [...prev, interaction]);

    // Store in localStorage for persistence (in a real app, this would go to a backend)
    const existingInteractions = JSON.parse(localStorage.getItem(`doc_interactions_${user.id}`) || '[]');
    const updatedInteractions = [...existingInteractions, interaction];
    localStorage.setItem(`doc_interactions_${user.id}`, JSON.stringify(updatedInteractions));
  }, [user?.id]);

  // Get document statistics
  const getDocumentStats = useCallback(() => {
    const interactions = JSON.parse(localStorage.getItem(`doc_interactions_${user?.id}`) || '[]');
    
    const stats = {
      totalViews: interactions.filter((i: DocumentInteraction) => i.action === 'view').length,
      totalDownloads: interactions.filter((i: DocumentInteraction) => i.action === 'download').length,
      totalSaved: savedDocuments.length,
      recentActivity: interactions
        .sort((a: DocumentInteraction, b: DocumentInteraction) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10)
    };

    return stats;
  }, [user?.id, savedDocuments.length]);

  // Check if document is saved
  const isDocumentSaved = useCallback((documentId: number) => {
    return savedDocuments.some(doc => doc.id === documentId);
  }, [savedDocuments]);

  // Generate document content based on type
  const generateDocumentContent = (filename: string, type: string): string => {
    const date = new Date().toLocaleDateString('fr-FR');
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return `Document PDF: ${filename}\nGénéré le: ${date}\n\nContenu de formation avec exercices et ressources pédagogiques.`;
      case 'docx':
      case 'doc':
        return `Document Word: ${filename}\nDate: ${date}\n\nRapport de formation et notes d'étude détaillées.`;
      case 'txt':
        return `Notes de formation - ${filename}\nCréé le: ${date}\n\nPoints clés et instructions pour le module de formation.`;
      case 'pptx':
      case 'ppt':
        return `Présentation: ${filename}\nDate: ${date}\n\nDiapositives de formation avec contenu éducatif.`;
      case 'xlsx':
      case 'xls':
        return `Feuille de calcul: ${filename}\nDate: ${date}\n\nDonnées et exercices pratiques.`;
      default:
        return `Fichier: ${filename}\nDate: ${date}\n\nContenu de formation.`;
    }
  };

  // Get content type for download
  const getContentType = (type: string): string => {
    const extension = type.toLowerCase();
    const contentTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif'
    };

    return contentTypes[extension] || 'application/octet-stream';
  };

  return {
    savedDocuments,
    saveDocument,
    removeSavedDocument,
    downloadDocument,
    viewDocument,
    loadSavedDocuments,
    getDocumentStats,
    isDocumentSaved,
    documentInteractions
  };
};