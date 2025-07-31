import { Quiz } from '@/types/quiz';

export interface TestUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee';
  department?: string;
  teamId?: number;
  avatar?: string;
}

export interface TestCourse {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: string;
  contentType: 'video' | 'text' | 'audio' | 'mixed';
  targetAudience: string[];
  learningObjectives: string[];
  isMandatory: boolean;
  completionRate: number;
  enrolledUsers: number;
  averageScore: number;
}

export interface TestTask {
  id: number;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string[];
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  category: 'mandatory' | 'professional_development' | 'role_specific';
  courseId?: string;
  completionCriteria: string;
}

export interface TestProgress {
  userId: number;
  courseId: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  lastAccessed: string;
  timeSpent: number;
  quizAttempts: number;
  quizScore?: number;
}

class TestDataService {
  constructor() {
    // Auto-initialize test data if not already present
    this.autoInitialize();
  }

  private autoInitialize(): void {
    const testUsers = localStorage.getItem('moov_test_users');
    const testProgress = localStorage.getItem('moov_test_progress');
    
    if (!testUsers) {
      this.initializeTestData();
      console.log('✅ Test data automatically initialized');
    }
    
    // Always initialize progress data with the latest structure
    localStorage.setItem('moov_test_progress', JSON.stringify(this.testProgress));
    console.log('✅ Test progress data force-initialized with Sarah Chen data:', this.testProgress);
    console.log('✅ Sarah Chen progress entries:', this.testProgress.filter(p => p.userId === 1));
  }

  private testUsers: TestUser[] = [
    {
      id: 1,
      email: 'sarah.chen@moov.com',
      name: 'Sarah Chen',
      role: 'admin',
      department: 'Learning & Development',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b129?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      email: 'marc.dubois@moov.com',
      name: 'Marc Dubois',
      role: 'team_chief',
      department: 'Marketing',
      teamId: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      email: 'julie.martin@moov.com',
      name: 'Julie Martin',
      role: 'employee',
      department: 'Marketing',
      teamId: 1,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      email: 'ahmed.hassan@moov.com',
      name: 'Ahmed Hassan',
      role: 'employee',
      department: 'Sales',
      teamId: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      email: 'lisa.wong@moov.com',
      name: 'Lisa Wong',
      role: 'employee',
      department: 'Customer Service',
      teamId: 3,
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face'
    }
  ];

  private testCourses: TestCourse[] = [
    {
      id: 'customer-service-excellence',
      title: 'Excellence en Service Client',
      description: 'Formation complète sur les techniques de service client, la gestion des situations difficiles et les meilleures pratiques de communication.',
      level: 'beginner',
      duration: '2h 30min',
      category: 'Service Client',
      contentType: 'mixed',
      targetAudience: ['Customer Service', 'Sales'],
      learningObjectives: [
        'Gérer les clients difficiles avec professionnalisme',
        'Appliquer les techniques de désescalade',
        'Comprendre les politiques de service de l\'entreprise',
        'Améliorer la satisfaction client'
      ],
      isMandatory: true,
      completionRate: 78,
      enrolledUsers: 45,
      averageScore: 82
    },
    {
      id: 'gdpr-compliance',
      title: 'Conformité RGPD et Protection des Données',
      description: 'Formation obligatoire sur la protection des données personnelles, les obligations RGPD et les bonnes pratiques de sécurité.',
      level: 'intermediate',
      duration: '1h 45min',
      category: 'Conformité',
      contentType: 'text',
      targetAudience: ['All Employees'],
      learningObjectives: [
        'Comprendre les principes du RGPD',
        'Identifier les risques de conformité',
        'Appliquer les bonnes pratiques de traitement des données',
        'Réagir en cas de violation de données'
      ],
      isMandatory: true,
      completionRate: 92,
      enrolledUsers: 120,
      averageScore: 87
    },
    {
      id: 'advanced-sales-techniques',
      title: 'Techniques de Vente Avancées',
      description: 'Développez vos compétences en vente consultative, gestion des objections et techniques de closing pour maximiser vos résultats.',
      level: 'advanced',
      duration: '3h 15min',
      category: 'Vente',
      contentType: 'video',
      targetAudience: ['Sales'],
      learningObjectives: [
        'Maîtriser la vente consultative',
        'Gérer efficacement les objections',
        'Appliquer les techniques de closing',
        'Développer des relations client durables'
      ],
      isMandatory: false,
      completionRate: 65,
      enrolledUsers: 28,
      averageScore: 79
    },
    {
      id: 'leadership-fundamentals',
      title: 'Fondamentaux du Leadership',
      description: 'Formation essentielle pour les futurs managers sur la gestion d\'équipe, la résolution de conflits et la gestion de performance.',
      level: 'intermediate',
      duration: '4h 00min',
      category: 'Management',
      contentType: 'mixed',
      targetAudience: ['team_chief', 'team_responsible'],
      learningObjectives: [
        'Développer ses compétences de leadership',
        'Gérer les conflits en équipe',
        'Motiver et fidéliser ses collaborateurs',
        'Conduire les entretiens de performance'
      ],
      isMandatory: false,
      completionRate: 71,
      enrolledUsers: 15,
      averageScore: 85
    },
    {
      id: 'formation-moov',
      title: 'Formation Moov - Services et Intelligence Artificielle',
      description: 'Formation complète sur les services Moov, l\'intelligence artificielle et les argumentaires de vente. Inclut des présentations, documentations techniques et supports audio.',
      level: 'intermediate',
      duration: '3h 45min',
      category: 'Formation Produit',
      contentType: 'mixed',
      targetAudience: ['Sales', 'Customer Service', 'All Employees'],
      learningObjectives: [
        'Maîtriser les services Moov (Voix, SMS, Data)',
        'Comprendre l\'Intelligence Artificielle Moov',
        'Appliquer les argumentaires de vente',
        'Utiliser les présentations commerciales'
      ],
      isMandatory: true,
      completionRate: 45,
      enrolledUsers: 89,
      averageScore: 78
    }
  ];

  private testTasks: TestTask[] = [
    {
      id: 1,
      title: 'Compléter la Formation Moov',
      description: 'Formation obligatoire sur les services Moov, l\'intelligence artificielle et les argumentaires de vente',
      assignedBy: 'Sarah Chen',
      assignedTo: ['Sales', 'Customer Service', 'All Employees'],
      deadline: '2025-02-28',
      priority: 'high',
      status: 'in-progress',
      progress: 35,
      category: 'mandatory',
      courseId: 'formation-moov',
      completionCriteria: 'Compléter toutes les sections et réussir le quiz avec 80% minimum'
    },
    {
      id: 2,
      title: 'Compléter la Formation RGPD',
      description: 'Formation obligatoire sur la conformité RGPD à compléter avant la fin du mois',
      assignedBy: 'Sarah Chen',
      assignedTo: ['All Employees'],
      deadline: '2025-01-30',
      priority: 'high',
      status: 'in-progress',
      progress: 45,
      category: 'mandatory',
      courseId: 'gdpr-compliance',
      completionCriteria: 'Réussir le quiz avec 85% minimum'
    },
    {
      id: 3,
      title: 'Améliorer les Compétences Service Client',
      description: 'Formation sur l\'excellence en service client pour améliorer la satisfaction client',
      assignedBy: 'Marc Dubois',
      assignedTo: ['Customer Service Team'],
      deadline: '2025-02-15',
      priority: 'medium',
      status: 'in-progress',
      progress: 60,
      category: 'professional_development',
      courseId: 'customer-service-excellence',
      completionCriteria: 'Terminer le cours et obtenir la certification'
    },
    {
      id: 4,
      title: 'Formation Trimestrielle Équipe Vente',
      description: 'Formation avancée sur les techniques de vente pour l\'équipe commerciale',
      assignedBy: 'Sarah Chen',
      assignedTo: ['Sales Team'],
      deadline: '2025-03-31',
      priority: 'high',
      status: 'pending',
      progress: 25,
      category: 'role_specific',
      courseId: 'advanced-sales-techniques',
      completionCriteria: 'Compléter 3 cours connexes avec note de passage'
    },
    {
      id: 5,
      title: 'Développement Leadership',
      description: 'Formation au leadership pour les futurs managers',
      assignedBy: 'Sarah Chen',
      assignedTo: ['Team Leaders'],
      deadline: '2025-04-15',
      priority: 'medium',
      status: 'pending',
      progress: 10,
      category: 'professional_development',
      courseId: 'leadership-fundamentals',
      completionCriteria: 'Compléter le cours et passer l\'évaluation'
    }
  ];

  private testProgress: TestProgress[] = [
    // Sarah Chen (admin) progress
    {
      userId: 1,
      courseId: 'formation-moov',
      progress: 35,
      status: 'in_progress',
      lastAccessed: '2024-12-27',
      timeSpent: 120,
      quizAttempts: 0
    },
    {
      userId: 1,
      courseId: 'gdpr-compliance',
      progress: 45,
      status: 'in_progress',
      lastAccessed: '2024-12-26',
      timeSpent: 85,
      quizAttempts: 0
    },
    {
      userId: 1,
      courseId: 'customer-service-excellence',
      progress: 100,
      status: 'completed',
      lastAccessed: '2024-12-20',
      timeSpent: 150,
      quizAttempts: 1,
      quizScore: 88
    },
    // Other users progress
    {
      userId: 3,
      courseId: 'customer-service-excellence',
      progress: 60,
      status: 'in_progress',
      lastAccessed: '2024-12-26',
      timeSpent: 90,
      quizAttempts: 0
    },
    {
      userId: 4,
      courseId: 'advanced-sales-techniques',
      progress: 100,
      status: 'completed',
      lastAccessed: '2024-12-25',
      timeSpent: 195,
      quizAttempts: 1,
      quizScore: 85
    },
    {
      userId: 5,
      courseId: 'gdpr-compliance',
      progress: 5,
      status: 'in_progress',
      lastAccessed: '2024-12-27',
      timeSpent: 10,
      quizAttempts: 0
    },
    {
      userId: 3,
      courseId: 'gdpr-compliance',
      progress: 100,
      status: 'completed',
      lastAccessed: '2024-12-24',
      timeSpent: 105,
      quizAttempts: 2,
      quizScore: 88
    }
  ];

  private testQuizzes: Quiz[] = [
    {
      id: 'quiz-customer-service',
      courseId: 'customer-service-excellence',
      title: 'Quiz Excellence Service Client',
      description: 'Évaluation des compétences en service client',
      passingGrade: 80,
      timeLimit: 20,
      questions: [
        {
          id: 'cs-q1',
          question: 'Quelle est la première étape pour gérer un client mécontent ?',
          options: [
            'Défendre immédiatement la position de l\'entreprise',
            'Écouter activement et montrer de l\'empathie',
            'Transférer le client vers un superviseur',
            'Proposer immédiatement une solution'
          ],
          correctAnswer: 1,
          explanation: 'L\'écoute active et l\'empathie permettent de comprendre le problème et de calmer le client.',
          difficulty: 'easy'
        },
        {
          id: 'cs-q2',
          question: 'Comment appliquer la technique de désescalade ?',
          options: [
            'Parler plus fort que le client',
            'Utiliser un ton calme et des mots apaisants',
            'Ignorer les émotions du client',
            'Répéter les règles de l\'entreprise'
          ],
          correctAnswer: 1,
          explanation: 'Un ton calme et des mots apaisants aident à réduire la tension et à créer un environnement de résolution.',
          difficulty: 'medium'
        }
      ],
      createdBy: 'Sarah Chen',
      createdAt: '2024-12-20',
      isActive: true
    },
    {
      id: 'quiz-gdpr',
      courseId: 'gdpr-compliance',
      title: 'Quiz Conformité RGPD',
      description: 'Évaluation des connaissances RGPD',
      passingGrade: 85,
      timeLimit: 25,
      questions: [
        {
          id: 'gdpr-q1',
          question: 'Quelle est la durée maximale pour notifier une violation de données à l\'autorité de contrôle ?',
          options: [
            '24 heures',
            '48 heures',
            '72 heures',
            '1 semaine'
          ],
          correctAnswer: 2,
          explanation: 'Le RGPD impose une notification dans les 72 heures suivant la découverte de la violation.',
          difficulty: 'medium'
        },
        {
          id: 'gdpr-q2',
          question: 'Quel est le principe de base du traitement des données personnelles ?',
          options: [
            'Collecter le maximum de données',
            'Minimisation des données',
            'Conserver indéfiniment',
            'Partager librement'
          ],
          correctAnswer: 1,
          explanation: 'Le principe de minimisation impose de collecter uniquement les données nécessaires à la finalité.',
          difficulty: 'easy'
        }
      ],
      createdBy: 'Sarah Chen',
      createdAt: '2024-12-18',
      isActive: true
    }
  ];

  getTestUsers(): TestUser[] {
    return this.testUsers;
  }

  getTestCourses(): TestCourse[] {
    return this.testCourses;
  }

  getTestTasks(): TestTask[] {
    return this.testTasks;
  }

  getTestProgress(): TestProgress[] {
    return this.testProgress;
  }

  getTestQuizzes(): Quiz[] {
    return this.testQuizzes;
  }

  getUserById(id: number): TestUser | undefined {
    return this.testUsers.find(user => user.id === id);
  }

  getCourseById(id: string): TestCourse | undefined {
    return this.testCourses.find(course => course.id === id);
  }

  getCoursesForUser(userId: number): any[] {
    console.log('🔍 getCoursesForUser called with userId:', userId);
    console.log('🔍 Available testCourses COUNT:', this.testCourses.length);
    console.log('🔍 Available testCourses:', this.testCourses.map(c => ({id: c.id, title: c.title})));
    
    const user = this.getUserById(userId);
    if (!user) {
      console.warn('❌ User not found for ID:', userId);
      return [];
    }

    try {
      // Include ALL courses from testCourses (which now includes formation-moov)
      console.log('🔍 Processing testCourses, total count:', this.testCourses.length);
      const transformedCourses = this.testCourses.map(course => {
        // Ensure all required properties exist
        if (!course || !course.id || !course.title) {
          console.warn('❌ Invalid course data:', course);
          return null;
        }

        console.log('✅ Processing course:', course.id, course.title);
        return {
          id: course.id,
          originalId: course.id, // Preserve the original string ID
          title: course.title,
          instructor: 'Instructeur Expert',
          duration: course.duration || '2h 00min',
          students: course.enrolledUsers || 0,
          rating: 4.5,
          progress: Math.floor(Math.random() * 100), // Random progress for demo
          image: '/placeholder.svg',
          category: course.category || 'Formation',
          level: course.level === 'beginner' ? 'Débutant' : 
                 course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé',
          description: course.description
        };
      });

      // Filter out any null values
      const validCourses = transformedCourses.filter(course => course !== null);
      console.log('Transformed courses (including Formation Moov):', validCourses);
      
      return validCourses;
    } catch (error) {
      console.error('Error transforming courses:', error);
      return [];
    }
  }

  getTasksForUser(userId: number) {
    const allTasks = [
      {
        id: 1,
        title: "Compléter la Formation Moov",
        description: "Terminer la formation complète sur les services Moov et l'intelligence artificielle",
        courseId: "formation-moov",
        assignedBy: "Sarah Chen",
        priority: "high",
        status: "in-progress",
        progress: 35,
        deadline: "2025-02-28",
        category: "mandatory",
        completionCriteria: "Compléter toutes les sections et réussir le quiz avec 80% minimum",
        evaluation: null,
        timeLimit: "3 heures 45 minutes"
      },
      {
        id: 2,
        title: "Formation RGPD Obligatoire",
        description: "Compléter la formation sur la conformité RGPD et protection des données",
        courseId: "gdpr-compliance",
        assignedBy: "Sarah Chen",
        priority: "high",
        status: "in-progress",
        progress: 45,
        deadline: "2025-01-30",
        category: "mandatory",
        completionCriteria: "Réussir le quiz avec 85% minimum",
        evaluation: null,
        timeLimit: "1 heure 45 minutes"
      },
      {
        id: 3,
        title: "Excellence en Service Client",
        description: "Formation sur les techniques de service client et gestion des situations difficiles",
        courseId: "customer-service-excellence",
        assignedBy: "Marc Dubois",
        priority: "medium",
        status: "in-progress",
        progress: 60,
        deadline: "2025-02-15",
        category: "professional_development",
        completionCriteria: "Terminer le cours et obtenir la certification",
        evaluation: 78,
        timeLimit: "2 heures 30 minutes"
      },
      {
        id: 4,
        title: "Techniques de Vente Avancées",
        description: "Développer vos compétences en vente consultative et gestion des objections",
        courseId: "advanced-sales-techniques",
        assignedBy: "Sarah Chen",
        priority: "medium",
        status: "pending",
        progress: 25,
        deadline: "2025-03-31",
        category: "role_specific",
        completionCriteria: "Compléter 3 modules connexes avec note de passage",
        evaluation: null,
        timeLimit: "3 heures 15 minutes"
      },
      {
        id: 5,
        title: "Formation Leadership",
        description: "Formation essentielle pour les futurs managers sur la gestion d'équipe",
        courseId: "leadership-fundamentals",
        assignedBy: "Sarah Chen",
        priority: "low",
        status: "pending",
        progress: 10,
        deadline: "2025-04-15",
        category: "professional_development",
        completionCriteria: "Compléter le cours et passer l'évaluation",
        evaluation: null,
        timeLimit: "4 heures"
      }
    ];

    // Return relevant tasks based on user role
    const user = this.getUserById(userId);
    if (!user) return allTasks;

    // Filter tasks based on user role and department
    return allTasks.filter(task => {
      if (task.category === 'mandatory') return true; // Everyone gets mandatory tasks
      
      if (user.role === 'admin') return true; // Admins see all tasks
      
      if (task.courseId === 'customer-service-excellence' && user.department === 'Customer Service') return true;
      if (task.courseId === 'advanced-sales-techniques' && user.department === 'Sales') return true;
      if (task.courseId === 'leadership-fundamentals' && (user.role === 'team_chief' || user.role === 'team_responsible')) return true;
      
      return task.category === 'professional_development'; // Include professional development for all
    });
  }

  getUserProgress(userId: number): TestProgress[] {
    return this.testProgress.filter(progress => progress.userId === userId);
  }

  // Update user progress dynamically
  updateUserProgress(userId: number, courseId: string, progress: number, timeSpent?: number): void {
    const existingIndex = this.testProgress.findIndex(p => p.userId === userId && p.courseId === courseId);
    
    const now = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    if (existingIndex >= 0) {
      // Update existing progress
      this.testProgress[existingIndex] = {
        ...this.testProgress[existingIndex],
        progress,
        status: progress >= 100 ? 'completed' : 'in_progress',
        lastAccessed: now,
        timeSpent: (this.testProgress[existingIndex].timeSpent || 0) + (timeSpent || 0)
      };
    } else {
      // Create new progress entry
      this.testProgress.push({
        userId,
        courseId,
        progress,
        status: progress >= 100 ? 'completed' : 'in_progress',
        lastAccessed: now,
        timeSpent: timeSpent || 0,
        quizAttempts: 0
      });
    }
    
    // Update localStorage to persist changes
    localStorage.setItem('moov_test_progress', JSON.stringify(this.testProgress));
    
    // Dispatch custom event to update UI
    window.dispatchEvent(new CustomEvent('progressUpdated'));
  }

  // Update quiz results
  updateQuizResult(userId: number, courseId: string, score: number, attempts: number): void {
    const existingIndex = this.testProgress.findIndex(p => p.userId === userId && p.courseId === courseId);
    
    if (existingIndex >= 0) {
      this.testProgress[existingIndex] = {
        ...this.testProgress[existingIndex],
        quizScore: score,
        quizAttempts: attempts,
        status: score >= 80 ? 'completed' : 'in_progress' // Assuming 80% is passing
      };
    }
    
    // Update localStorage
    localStorage.setItem('moov_test_progress', JSON.stringify(this.testProgress));
  }

  // Initialize test data in localStorage
  initializeTestData(): void {
    // Store test users for authentication
    localStorage.setItem('moov_test_users', JSON.stringify(this.testUsers));
    
    // Store courses
    localStorage.setItem('moov_test_courses', JSON.stringify(this.testCourses));
    
    // Store tasks
    localStorage.setItem('moov_test_tasks', JSON.stringify(this.testTasks));
    
    // Store progress
    localStorage.setItem('moov_test_progress', JSON.stringify(this.testProgress));
    
    // Store quizzes
    localStorage.setItem('moov_test_quizzes', JSON.stringify(this.testQuizzes));
    
    console.log('Test data initialized successfully');
  }

  // Generate realistic analytics data
  generateAnalyticsData(): void {
    const analyticsData = {
      totalUsers: this.testUsers.length,
      totalQuizzes: this.testProgress.filter(p => p.quizAttempts > 0).length,
      averageCompletionRate: 73,
      averageScore: 84,
      topPerformers: [
        { userId: '4', name: 'Ahmed Hassan', score: 85 },
        { userId: '3', name: 'Julie Martin', score: 88 },
        { userId: '5', name: 'Lisa Wong', score: 82 }
      ],
      skillGaps: [
        { area: 'Service Client', averageScore: 78, usersCount: 12 },
        { area: 'Conformité', averageScore: 87, usersCount: 35 },
        { area: 'Vente', averageScore: 79, usersCount: 8 }
      ]
    };
    
    localStorage.setItem('moov_analytics_data', JSON.stringify(analyticsData));
  }
}

export const testDataService = new TestDataService();
