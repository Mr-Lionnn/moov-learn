
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  FolderOpen,
  Plus,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Files = () => {
  const { user, hasPermission, canAccessFiles } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample files data
  const files = [
    {
      id: 1,
      name: "Configuration Réseau Template.pdf",
      category: "Templates",
      size: "2.4 MB",
      uploadedBy: "Adeline Agbodjan",
      uploadDate: "2024-01-15",
      downloads: 45,
      type: "pdf",
      department: "IT"
    },
    {
      id: 2,
      name: "Procédures Sécurité.docx",
      category: "Documentation",
      size: "1.8 MB",
      uploadedBy: "Christelle Adjovi",
      uploadDate: "2024-01-20",
      downloads: 32,
      type: "docx",
      department: "Security"
    },
    {
      id: 3,
      name: "Formation Cisco Routing.pptx",
      category: "Formations",
      size: "15.6 MB",
      uploadedBy: "Rodrigue Hounkpatin",
      uploadDate: "2024-01-18",
      downloads: 78,
      type: "pptx",
      department: "Network"
    },
    {
      id: 4,
      name: "Checklist Maintenance.xlsx",
      category: "Checklists",
      size: "0.8 MB",
      uploadedBy: "Olivier Tognon",
      uploadDate: "2024-01-22",
      downloads: 23,
      type: "xlsx",
      department: "Maintenance"
    }
  ];

  const categories = ["all", "Templates", "Documentation", "Formations", "Checklists"];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  const canUpload = hasPermission('upload_files') || hasPermission('manage_files');
  const canEdit = hasPermission('manage_files') || hasPermission('edit_limited');
  const canDelete = hasPermission('manage_files');

  if (!canAccessFiles()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
              <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder aux fichiers.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Fichiers</h1>
              <p className="text-gray-600">Gérez et organisez vos documents de formation</p>
            </div>
            {canUpload && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Fichier
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "Tous" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{file.size}</span>
                          <Badge variant="secondary">{file.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {file.uploadDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {file.uploadedBy.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{file.uploadedBy}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-400">{file.downloads} téléchargements</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun fichier trouvé</h3>
              <p className="text-gray-600">
                {searchQuery ? "Essayez de modifier votre recherche" : "Aucun fichier dans cette catégorie"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Files;
