export interface ModuleContent {
  id: string;
  type: 'text' | 'video' | 'audio' | 'quiz' | 'image' | 'document';
  title: string;
  order: number;
  content?: string; // For text content
  duration?: number; // For video/audio in seconds
  fileUrl?: string; // For video/audio/image/document
  fileName?: string; // For document uploads
  fileSize?: number; // In bytes
  transcriptUrl?: string; // For video/audio
  thumbnailUrl?: string; // For video
  quizId?: string; // For quiz content
}

export interface ModuleSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  contents: ModuleContent[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // In minutes
  sections: ModuleSection[];
  prerequisites?: string[]; // Module IDs
  tags: string[];
  isPublished: boolean;
  isDraft: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface QuizQuestionAdvanced {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'text-input';
  question: string;
  options?: string[]; // For multiple choice/select
  correctAnswers: number[]; // Array for multiple select, single item for others
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  hasImage?: boolean;
  imageUrl?: string;
  tags?: string[];
  // For multiple select specific configuration
  minSelections?: number;
  maxSelections?: number;
}

export interface AdvancedQuiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestionAdvanced[];
  passingGrade: number;
  timeLimit?: number; // In minutes
  maxAttempts: number;
  showFeedback: 'immediate' | 'after-completion' | 'never';
  randomizeQuestions: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}