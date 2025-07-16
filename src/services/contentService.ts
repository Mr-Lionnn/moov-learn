import { ContentFile, Team, ContentProgress } from '@/types/content';

class ContentService {
  private mockTeams: Team[] = [
    {
      id: 1,
      name: "Équipe Technique",
      description: "Développeurs et ingénieurs systèmes",
      memberCount: 12,
      leaderId: 1,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Équipe Marketing",
      description: "Marketing et communication",
      memberCount: 8,
      leaderId: 2,
      createdAt: "2024-01-20"
    },
    {
      id: 3,
      name: "Équipe Commercial",
      description: "Ventes et relation client",
      memberCount: 15,
      leaderId: 3,
      createdAt: "2024-01-25"
    },
    {
      id: 4,
      name: "Équipe RH",
      description: "Ressources humaines",
      memberCount: 5,
      leaderId: 4,
      createdAt: "2024-02-01"
    }
  ];

  private mockFiles: ContentFile[] = [
    {
      id: "content_1",
      name: "Introduction aux Réseaux TCP/IP.pdf",
      type: "pdf",
      size: "2.4 MB",
      url: "#pdf_sample_1",
      author: "Dr. Ahmed Mansouri",
      uploadDate: "2024-01-15T10:30:00Z",
      downloads: 45,
      teamIds: [1, 2],
      category: "formation",
      description: "Guide complet sur les fondamentaux des réseaux TCP/IP",
      pages: 24
    },
    {
      id: "content_2",
      name: "Sécurité Informatique - Best Practices.docx",
      type: "docx",
      size: "1.8 MB",
      url: "#docx_sample_1",
      author: "Sarah Ben Ali",
      uploadDate: "2024-01-18T14:20:00Z",
      downloads: 32,
      teamIds: [1, 3],
      category: "documentation",
      description: "Document détaillé sur les meilleures pratiques de sécurité",
      pages: 18
    },
    {
      id: "content_3",
      name: "Présentation Cloud Computing.pptx",
      type: "pptx",
      size: "5.2 MB",
      url: "#pptx_sample_1",
      author: "Mohamed Trabelsi",
      uploadDate: "2024-01-22T09:15:00Z",
      downloads: 28,
      teamIds: [1, 2, 3],
      category: "formation",
      description: "Introduction au cloud computing et ses applications",
      pages: 35
    },
    {
      id: "content_4",
      name: "Formation Linux Administration.mp4",
      type: "mp4",
      size: "145.6 MB",
      url: "#video_sample_1",
      author: "Karim Benali",
      uploadDate: "2024-01-25T16:45:00Z",
      downloads: 67,
      teamIds: [1],
      category: "formation",
      description: "Cours vidéo complet sur l'administration Linux",
      duration: "1h 25min"
    },
    {
      id: "content_5",
      name: "Podcast - Tendances IT 2024.mp3",
      type: "mp3",
      size: "89.3 MB",
      url: "#audio_sample_1",
      author: "Leila Khedira",
      uploadDate: "2024-02-01T11:00:00Z",
      downloads: 23,
      teamIds: [1, 2, 3, 4],
      category: "ressources",
      description: "Discussion sur les tendances technologiques de 2024",
      duration: "45min"
    },
    {
      id: "content_6",
      name: "Architecture Réseau Entreprise.jpg",
      type: "jpg",
      size: "3.1 MB",
      url: "#image_sample_1",
      author: "Nabil Hamdi",
      uploadDate: "2024-02-03T13:30:00Z",
      downloads: 19,
      teamIds: [1, 2],
      category: "documentation",
      description: "Schéma d'architecture réseau pour grande entreprise"
    }
  ];

  private mockProgress: ContentProgress[] = [
    {
      userId: 1,
      contentId: "content_1",
      progress: 85,
      lastAccessedAt: "2024-02-10T14:30:00Z",
      currentPage: 20,
      completed: false
    },
    {
      userId: 1,
      contentId: "content_4",
      progress: 45,
      lastAccessedAt: "2024-02-08T16:20:00Z",
      currentTime: 2280, // 38 minutes
      completed: false
    }
  ];

  // Teams
  getTeams(): Team[] {
    return [...this.mockTeams];
  }

  getTeamById(teamId: number): Team | undefined {
    return this.mockTeams.find(team => team.id === teamId);
  }

  getUserTeams(userId: number): Team[] {
    // Mock: return teams based on user role/assignment
    return this.mockTeams.filter(team => team.memberCount > 0);
  }

  // Content Files
  getAllContent(): ContentFile[] {
    return [...this.mockFiles];
  }

  getContentForUser(userId: number): ContentFile[] {
    // Get user's teams (mock implementation)
    const userTeams = this.getUserTeams(userId);
    const userTeamIds = userTeams.map(team => team.id);
    
    return this.mockFiles.filter(file => 
      file.teamIds.some(teamId => userTeamIds.includes(teamId))
    );
  }

  getContentByTeam(teamId: number): ContentFile[] {
    return this.mockFiles.filter(file => file.teamIds.includes(teamId));
  }

  getContentByType(type: ContentFile['type']): ContentFile[] {
    return this.mockFiles.filter(file => file.type === type);
  }

  getContentByCategory(category: string): ContentFile[] {
    return this.mockFiles.filter(file => file.category === category);
  }

  searchContent(query: string): ContentFile[] {
    const lowercaseQuery = query.toLowerCase();
    return this.mockFiles.filter(file =>
      file.name.toLowerCase().includes(lowercaseQuery) ||
      file.description?.toLowerCase().includes(lowercaseQuery) ||
      file.author.toLowerCase().includes(lowercaseQuery) ||
      file.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  getContentById(contentId: string): ContentFile | undefined {
    return this.mockFiles.find(file => file.id === contentId);
  }

  // Progress tracking
  getUserProgress(userId: number): ContentProgress[] {
    return this.mockProgress.filter(progress => progress.userId === userId);
  }

  getContentProgress(userId: number, contentId: string): ContentProgress | undefined {
    return this.mockProgress.find(progress => 
      progress.userId === userId && progress.contentId === contentId
    );
  }

  updateProgress(userId: number, contentId: string, progressData: Partial<ContentProgress>): void {
    const existingIndex = this.mockProgress.findIndex(progress =>
      progress.userId === userId && progress.contentId === contentId
    );

    if (existingIndex >= 0) {
      this.mockProgress[existingIndex] = {
        ...this.mockProgress[existingIndex],
        ...progressData,
        lastAccessedAt: new Date().toISOString()
      };
    } else {
      this.mockProgress.push({
        userId,
        contentId,
        progress: 0,
        lastAccessedAt: new Date().toISOString(),
        completed: false,
        ...progressData
      });
    }
  }

  // File operations
  uploadFile(file: ContentFile): void {
    this.mockFiles.push({
      ...file,
      uploadDate: new Date().toISOString(),
      downloads: 0
    });
  }

  deleteFile(contentId: string): boolean {
    const index = this.mockFiles.findIndex(file => file.id === contentId);
    if (index >= 0) {
      this.mockFiles.splice(index, 1);
      return true;
    }
    return false;
  }

  incrementDownloadCount(contentId: string): void {
    const file = this.mockFiles.find(file => file.id === contentId);
    if (file) {
      file.downloads += 1;
    }
  }

  // Analytics
  getMostDownloaded(limit: number = 5): ContentFile[] {
    return [...this.mockFiles]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  getRecentUploads(limit: number = 5): ContentFile[] {
    return [...this.mockFiles]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, limit);
  }

  getContentStats() {
    const totalFiles = this.mockFiles.length;
    const totalDownloads = this.mockFiles.reduce((sum, file) => sum + file.downloads, 0);
    const typeStats = this.mockFiles.reduce((stats, file) => {
      stats[file.type] = (stats[file.type] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);

    return {
      totalFiles,
      totalDownloads,
      typeStats,
      avgDownloadsPerFile: totalFiles > 0 ? Math.round(totalDownloads / totalFiles) : 0
    };
  }
}

export const contentService = new ContentService();