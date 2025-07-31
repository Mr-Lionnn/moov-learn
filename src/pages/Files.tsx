
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  FileVideo, 
  FileAudio,
  File,
  ArrowLeft,
  Save,
  Bookmark,
  Calendar,
  FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import DocumentViewer from "@/components/enhanced/DocumentViewer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import RoleBasedAccess from "@/components/enhanced/RoleBasedAccess";

const Files = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { 
    savedDocuments, 
    saveDocument, 
    removeSavedDocument, 
    downloadDocument, 
    viewDocument, 
    loadSavedDocuments 
  } = useDocumentManager();

  // Load saved documents from localStorage on component mount
  useEffect(() => {
    loadSavedDocuments();
  }, [loadSavedDocuments]);

  // Handle file actions using the document manager
  const handleSaveDocument = (file: any, moduleId?: string) => {
    saveDocument(file, moduleId);
  };

  const handleRemoveSavedDocument = (fileId: number) => {
    removeSavedDocument(fileId);
  };

  const handleViewFile = (file: any) => {
    if (viewDocument(file)) {
      setSelectedFile(file);
    }
  };

  const handleDownloadFile = (file: any) => {
    downloadDocument(file);
  };

  const files = [
    {
      id: 1,
      name: "Configuration Réseau Template.pdf",
      size: "2.4 MB",
      type: "Templates",
      author: "Adeline Agbodan",
      downloads: 45,
      date: "2024-01-15",
      category: "template"
    },
    {
      id: 2,
      name: "Procédures Sécurité.docx",
      size: "1.8 MB",
      type: "Documentation",
      author: "Christelle Adjovi",
      downloads: 32,
      date: "2024-01-20",
      category: "documentation"
    },
    {
      id: 3,
      name: "Formation Cisco Routing.pptx",
      size: "15.6 MB",
      type: "Formations",
      author: "Rodrigue Hounkpatin",
      downloads: 78,
      date: "2024-01-18",
      category: "formation"
    },
    {
      id: 4,
      name: "Checklist Maintenance.xlsx",
      size: "892 KB",
      type: "Checklists",
      author: "Marie Martin",
      downloads: 23,
      date: "2024-01-22",
      category: "checklist"
    },
    {
      id: 5,
      name: "Guide VLAN Configuration.pdf",
      size: "3.2 MB",
      type: "Documentation",
      author: "Pierre Durand",
      downloads: 56,
      date: "2024-01-25",
      category: "documentation"
    }
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo className="h-8 w-8 text-purple-600" />;
      case 'mp3':
      case 'wav':
        return <FileAudio className="h-8 w-8 text-green-600" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="h-8 w-8 text-orange-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'templates':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'documentation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'formations':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checklists':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  const getCategoryFiles = (category: string) => {
    return filteredFiles.filter(file => 
      category === 'tous' || file.category === category
    );
  };

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fichiers</h1>
          <p className="text-gray-600">Accédez aux ressources et documents de formation</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>

        <Tabs defaultValue="tous" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="formation">Formations</TabsTrigger>
            <TabsTrigger value="checklist">Checklists</TabsTrigger>
          </TabsList>

          <TabsContent value="tous" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryFiles('tous').map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(file.type)} border text-xs`}>
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Par: {file.author}</p>
                        <p>{file.downloads} téléchargements</p>
                        <p>Créé le: {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSaveDocument(file)}
                          className="px-2"
                          title="Sauvegarder"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="template" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryFiles('template').map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(file.type)} border text-xs`}>
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Par: {file.author}</p>
                        <p>{file.downloads} téléchargements</p>
                        <p>Créé le: {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSaveDocument(file)}
                          className="px-2"
                          title="Sauvegarder"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryFiles('documentation').map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(file.type)} border text-xs`}>
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Par: {file.author}</p>
                        <p>{file.downloads} téléchargements</p>
                        <p>Créé le: {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSaveDocument(file)}
                          className="px-2"
                          title="Sauvegarder"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formation" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryFiles('formation').map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(file.type)} border text-xs`}>
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Par: {file.author}</p>
                        <p>{file.downloads} téléchargements</p>
                        <p>Créé le: {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSaveDocument(file)}
                          className="px-2"
                          title="Sauvegarder"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoryFiles('checklist').map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(file.type)} border text-xs`}>
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        <p>Par: {file.author}</p>
                        <p>{file.downloads} téléchargements</p>
                        <p>Créé le: {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleSaveDocument(file)}
                          className="px-2"
                          title="Sauvegarder"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </Tabs>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fichier trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </main>

      <DocumentViewer
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        file={selectedFile}
        onSave={handleSaveDocument}
        onDownload={handleDownloadFile}
      />
    </div>
  );
};

export default Files;
