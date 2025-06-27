
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save } from "lucide-react";
import { Quiz, QuizQuestion } from "@/types/quiz";

interface QuizCreatorProps {
  courseId: string;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizCreator = ({ courseId, onSave, onCancel }: QuizCreatorProps) => {
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    courseId,
    title: "",
    description: "",
    passingGrade: 70,
    timeLimit: 30,
    questions: [],
    isActive: true
  });

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: "medium"
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...(quiz.questions || [])];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = updatedOptions;
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions.splice(index, 1);
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSave = () => {
    if (!quiz.title || !quiz.questions?.length) return;

    const completeQuiz: Quiz = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId: quiz.courseId!,
      title: quiz.title,
      description: quiz.description || "",
      passingGrade: quiz.passingGrade || 70,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions,
      createdBy: "current_user",
      createdAt: new Date().toISOString(),
      isActive: quiz.isActive || true
    };

    onSave(completeQuiz);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Titre du Quiz</Label>
              <Input
                id="quiz-title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du quiz..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing-grade">Note de Passage (%)</Label>
              <Input
                id="passing-grade"
                type="number"
                min="0"
                max="100"
                value={quiz.passingGrade}
                onChange={(e) => setQuiz(prev => ({ ...prev, passingGrade: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={quiz.description}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du quiz..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-limit">Temps Limité (minutes)</Label>
            <Input
              id="time-limit"
              type="number"
              min="5"
              max="180"
              value={quiz.timeLimit}
              onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions du Quiz</h3>
          <Button onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Question
          </Button>
        </div>

        {quiz.questions?.map((question, qIndex) => (
          <Card key={question.id}>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Question {qIndex + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Tapez votre question ici..."
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Options de Réponse</Label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                        className="mr-2"
                      />
                      <Label className="text-sm text-green-600">Correcte</Label>
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Explication</Label>
                  <Textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    placeholder="Explication de la réponse correcte..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulté</Label>
                  <Select
                    value={question.difficulty}
                    onValueChange={(value) => updateQuestion(qIndex, 'difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={!quiz.title || !quiz.questions?.length}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizCreator;
