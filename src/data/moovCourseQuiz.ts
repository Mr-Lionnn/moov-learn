import { Quiz } from '@/types/quiz';

export const moovCourseQuiz: Quiz = {
  id: 'moov-course-quiz',
  courseId: 'formation-moov',
  title: 'Quiz Mensuel Formation Moov',
  description: 'Évaluation de vos connaissances sur les services Moov et l\'Intelligence Artificielle',
  passingGrade: 75,
  timeLimit: 30,
  questions: [
    {
      id: 'moov-q1',
      question: 'Que signifie MIA dans le contexte de Moov ?',
      options: [
        'Mobile Intelligence Application',
        'Moov Intelligence Artificielle',
        'Multi-Interface Access',
        'Mobile Integration Assistant'
      ],
      correctAnswer: 1,
      explanation: 'MIA fait référence à Moov Intelligence Artificielle, la solution IA de Moov.',
      difficulty: 'easy'
    },
    {
      id: 'moov-q2',
      question: 'Quels sont les trois principaux services proposés par Moov ?',
      options: [
        'Voix, SMS, Internet',
        'Voix, SMS, Data',
        'Appels, Messages, Navigation',
        'Téléphonie, Messagerie, Données'
      ],
      correctAnswer: 1,
      explanation: 'Moov propose principalement les services Voix, SMS et Data.',
      difficulty: 'medium'
    },
    {
      id: 'moov-q3',
      question: 'Dans l\'argumentaire de vente voix, quel est l\'avantage principal à mettre en avant ?',
      options: [
        'Le prix le plus bas du marché',
        'La qualité de service et la couverture réseau',
        'La simplicité d\'utilisation uniquement',
        'Les options gratuites seulement'
      ],
      correctAnswer: 1,
      explanation: 'La qualité de service et la couverture réseau sont les arguments clés pour les services voix.',
      difficulty: 'medium'
    },
    {
      id: 'moov-q4',
      question: 'Que signifie SVA dans les services Moov ?',
      options: [
        'Service à Valeur Ajoutée',
        'Système de Vente Automatisé',
        'Support Vocal Avancé',
        'Service de Vente Assistée'
      ],
      correctAnswer: 0,
      explanation: 'SVA signifie Service à Valeur Ajoutée, des services complémentaires proposés par Moov.',
      difficulty: 'easy'
    },
    {
      id: 'moov-q5',
      question: 'Dans le contexte de l\'Intelligence Artificielle Moov, quels sont les principaux bénéfices pour les clients ?',
      options: [
        'Automatisation uniquement',
        'Personnalisation et optimisation des services',
        'Réduction des coûts seulement',
        'Simplification de l\'interface'
      ],
      correctAnswer: 1,
      explanation: 'L\'IA Moov permet la personnalisation et l\'optimisation des services selon les besoins clients.',
      difficulty: 'hard'
    },
    {
      id: 'moov-q6',
      question: 'Pour les argumentaires commerciaux front office, quelle approche est recommandée ?',
      options: [
        'Présenter tous les services en même temps',
        'Se concentrer sur le prix uniquement',
        'Identifier d\'abord les besoins du client',
        'Utiliser un discours standardisé'
      ],
      correctAnswer: 2,
      explanation: 'Il est essentiel d\'identifier les besoins du client avant de présenter les solutions adaptées.',
      difficulty: 'medium'
    }
  ],
  createdBy: 'Formation Moov',
  createdAt: '2024-12-28',
  isActive: true
};