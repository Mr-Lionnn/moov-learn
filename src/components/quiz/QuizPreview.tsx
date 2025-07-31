import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Trophy, Play, RotateCcw, Eye } from "lucide-react";
import { Quiz } from "@/types/quiz";

interface QuizPreviewProps {
  quiz: Quiz;
  onClose: () => void;
  onEdit: () => void;
}

const QuizPreview = ({ quiz, onClose, onEdit }: QuizPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 300);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const startPreview = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 300);
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isPlaying) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Prévisualisation: {quiz.title}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onEdit}>
                  Modifier
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{quiz.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{quiz.timeLimit || "∞"}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{quiz.passingGrade}%</p>
                <p className="text-sm text-muted-foreground">Note requise</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {quiz.questions.filter(q => q.difficulty === 'hard').length}
                </p>
                <p className="text-sm text-muted-foreground">Questions difficiles</p>
              </div>
            </div>

            {quiz.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4">Aperçu des Questions</h3>
              <div className="space-y-3">
                {quiz.questions.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge 
                            variant={
                              question.difficulty === 'easy' ? 'default' :
                              question.difficulty === 'medium' ? 'secondary' : 'destructive'
                            }
                          >
                            {question.difficulty === 'easy' ? 'Facile' :
                             question.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                          </Badge>
                        </div>
                        <p className="font-medium mb-2">{question.question}</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="flex items-center gap-2">
                              {optionIndex === question.correctAnswer ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <div className="h-3 w-3 border border-muted-foreground rounded-full" />
                              )}
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startPreview} size="lg" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Commencer la Simulation Interactive
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Testez le quiz comme le verrait un apprenant
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingGrade;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className={`mx-auto p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Quiz Réussi!' : 'Quiz Non Réussi'}
          </CardTitle>
          <p className="text-muted-foreground">
            Score: {score} sur {quiz.questions.length} questions correctes
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentage}%
            </div>
            <Badge className={passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {passed ? 'Réussi' : 'Échoué'}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Révision des Réponses</h3>
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{question.question}</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Votre réponse:</span>{' '}
                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {userAnswer !== undefined ? question.options[userAnswer] : 'Aucune réponse'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Bonne réponse:</span>{' '}
                              <span className="text-green-700">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-muted-foreground mt-2">
                              <span className="font-medium">Explication:</span> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={resetPreview} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Recommencer la Simulation
            </Button>
            <Button onClick={onClose}>
              Terminer l'Aperçu
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
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Mode Simulation: {quiz.title}
          </CardTitle>
          <div className="flex items-center gap-4">
            {quiz.timeLimit && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Badge variant="outline">
              {currentQuestionIndex + 1} sur {quiz.questions.length}
            </Badge>
            <Button variant="outline" size="sm" onClick={resetPreview}>
              Quitter
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">
              Question {currentQuestionIndex + 1}
            </h3>
            <Badge 
              variant={
                currentQuestion.difficulty === 'easy' ? 'default' :
                currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'
              }
            >
              {currentQuestion.difficulty === 'easy' ? 'Facile' :
               currentQuestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {currentQuestion.question}
          </p>

          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
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
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Précédent
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer le Quiz' : 'Question Suivante'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizPreview;