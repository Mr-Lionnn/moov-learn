export interface ContentFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'mp4' | 'mp3' | 'jpg' | 'png' | 'txt';
  size: string;
  url: string;
  author: string;
  uploadDate: string;
  downloads: number;
  teamIds: number[];
  category: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string; // for video/audio files
  pages?: number; // for documents
}

export interface Team {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  leaderId: number;
  createdAt: string;
}

export interface ContentProgress {
  userId: number;
  contentId: string;
  progress: number; // 0-100
  lastAccessedAt: string;
  currentPage?: number;
  currentTime?: number; // for video/audio
  completed: boolean;
}

export interface ViewerState {
  zoom: number;
  rotation: number;
  currentPage: number;
  totalPages: number;
  fullscreen: boolean;
  loading: boolean;
  error?: string;
}