import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Trophy,
  RotateCcw,
  FileText
} from "lucide-react";
import { QuizResult } from "@/types/quiz";

interface QuizLessonTabProps {
  onComplete: (result: QuizResult) => void;
  title?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const sampleQuestions: Question[] = [
  {
    id: "q1",
    question: "Quelle est la première étape pour gérer un client mécontent ?",
    options: [
      "Défendre immédiatement la position de l'entreprise",
      "Écouter activement et montrer de l'empathie",
      "Transférer le client vers un superviseur",
      "Proposer immédiatement une solution"
    ],
    correctAnswer: 1,
    explanation: "L'écoute active et l'empathie permettent de comprendre le problème et de calmer le client.",
    difficulty: "easy"
  },
  {
    id: "q2",
    question: "Comment appliquer la technique de désescalade ?",
    options: [
      "Parler plus fort que le client",
      "Utiliser un ton calme et des mots apaisants",
      "Ignorer les émotions du client",
      "Répéter les règles de l'entreprise"
    ],
    correctAnswer: 1,
    explanation: "Un ton calme et des mots apaisants aident à réduire la tension et à créer un environnement de résolution.",
    difficulty: "medium"
  },
  {
    id: "q3",
    question: "Quelle est la meilleure approche pour fidéliser un client après un problème résolu ?",
    options: [
      "Oublier l'incident et passer au client suivant",
      "Faire un suivi pour s'assurer de sa satisfaction",
      "Offrir automatiquement une compensation",
      "Transférer le dossier à un autre service"
    ],
    correctAnswer: 1,
    explanation: "Le suivi démontre l'engagement de l'entreprise envers la satisfaction client et renforce la relation.",
    difficulty: "medium"
  },
  {
    id: "q4",
    question: "Dans une situation de conflit, quelle est la priorité absolue ?",
    options: [
      "Avoir raison à tout prix",
      "Maintenir la sécurité et le respect",
      "Convaincre le client qu'il a tort",
      "Appliquer strictement le règlement"
    ],
    correctAnswer: 1,
    explanation: "La sécurité et le respect mutuel sont essentiels pour créer un environnement de résolution constructive.",
    difficulty: "hard"
  },
  {
    id: "q5",
    question: "Comment mesurer l'efficacité de votre communication avec un client ?",
    options: [
      "Par la rapidité de la conversation",
      "Par la compréhension mutuelle et la satisfaction",
      "Par le nombre de mots utilisés",
      "Par l'absence de questions du client"
    ],
    correctAnswer: 1,
    explanation: "L'efficacité se mesure à la compréhension mutuelle et au niveau de satisfaction atteint.",
    difficulty: "medium"
  }
];

const QuizLessonTab = ({ onComplete, title = "Quiz d'Évaluation" }: QuizLessonTabProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const currentQ = sampleQuestions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];
  const allQuestionsAnswered = sampleQuestions.every(q => answers[q.id] !== undefined);

  React.useEffect(() => {
    if (timeRemaining <= 0 && !showResults) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: answerIndex
    }));
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    const feedback: any[] = [];

    sampleQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      feedback.push({
        questionId: question.id,
        userAnswer: userAnswer ?? -1,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect: isCorrect
      });
    });

    const percentage = Math.round((correctAnswers / sampleQuestions.length) * 100);
    const passed = percentage >= 70; // 70% passing grade

    const result = {
      correctAnswers,
      totalQuestions: sampleQuestions.length,
      percentage,
      passed,
      feedback,
      timeSpent: (15 * 60) - timeRemaining
    };

    setQuizResults(result);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(15 * 60);
    setShowResults(false);
    setQuizResults(null);
    setShowExplanation(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return 'Inconnu';
    }
  };

  if (showResults && quizResults) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Résultats du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Summary */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              quizResults.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {quizResults.passed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {quizResults.percentage}%
            </h3>
            <p className="text-lg mb-2">
              {quizResults.correctAnswers} / {quizResults.totalQuestions} questions correctes
            </p>
            <Badge className={quizResults.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {quizResults.passed ? 'Réussi' : 'Échoué'} - Note de passage: 70%
            </Badge>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Révision des Questions</h4>
            {sampleQuestions.map((question, index) => {
              const feedback = quizResults.feedback[index];
              return (
                <Card key={question.id} className={`border-l-4 ${
                  feedback.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-medium">Question {index + 1}</h5>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        {feedback.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="mb-3">{question.question}</p>
                    
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correctAnswer 
                              ? 'bg-green-100 text-green-800' 
                              : optionIndex === feedback.userAnswer 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-50'
                          }`}
                        >
                          {optionIndex === question.correctAnswer && '✓ '}
                          {optionIndex === feedback.userAnswer && optionIndex !== question.correctAnswer && '✗ '}
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    <Alert>
                      <AlertDescription>
                        <strong>Explication:</strong> {question.explanation}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleRetakeQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reprendre le Quiz
            </Button>
            
            <Button 
              onClick={() => onComplete(quizResults)} 
              className="moov-gradient text-white"
            >
              {quizResults.passed ? 'Continuer' : 'Terminer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} / {sampleQuestions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {timeRemaining < 300 && (
          <Alert className="border-red-200 bg-red-50">
            <Clock className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Attention! Il vous reste moins de 5 minutes pour terminer le quiz.
            </AlertDescription>
          </Alert>
        )}

        {/* Question */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">
              Question {currentQuestion + 1}
            </Badge>
            <Badge className={getDifficultyColor(currentQ.difficulty)}>
              {getDifficultyLabel(currentQ.difficulty)}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold mb-6">
            {currentQ.question}
          </h3>

          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedAnswer !== undefined && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {showExplanation ? 'Masquer' : 'Voir'} l'explication
              </Button>
              
              {showExplanation && (
                <Alert className="mt-3">
                  <AlertDescription>
                    <strong>Explication:</strong> {currentQ.explanation}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Précédent
          </Button>
          
          <div className="text-sm text-gray-600">
            Questions répondues: {Object.keys(answers).length} / {sampleQuestions.length}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="bg-primary text-white"
          >
            {currentQuestion === sampleQuestions.length - 1 ? 'Terminer le Quiz' : 'Suivant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizLessonTab;