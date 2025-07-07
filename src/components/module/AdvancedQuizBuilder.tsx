import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  Save, 
  ImageIcon,
  GripVertical,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Square,
  Edit3
} from "lucide-react";
import { QuizQuestionAdvanced, AdvancedQuiz } from "@/types/module";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface QuestionItemProps {
  question: QuizQuestionAdvanced;
  index: number;
  onUpdate: (index: number, field: keyof QuizQuestionAdvanced, value: any) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void;
  onUpdateCorrectAnswers: (questionIndex: number, answers: number[]) => void;
  onRemove: (index: number) => void;
}

const QuestionItem = ({ 
  question, 
  index, 
  onUpdate, 
  onUpdateOption, 
  onUpdateCorrectAnswers,
  onRemove 
}: QuestionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return <Square className="h-4 w-4" />;
      case 'multiple-select': return <CheckSquare className="h-4 w-4" />;
      case 'true-false': return <HelpCircle className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCorrectAnswerChange = (optionIndex: number, isCorrect: boolean) => {
    let newCorrectAnswers = [...question.correctAnswers];
    
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      // Single selection
      newCorrectAnswers = isCorrect ? [optionIndex] : [];
    } else if (question.type === 'multiple-select') {
      // Multiple selection
      if (isCorrect) {
        if (!newCorrectAnswers.includes(optionIndex)) {
          newCorrectAnswers.push(optionIndex);
        }
      } else {
        newCorrectAnswers = newCorrectAnswers.filter(idx => idx !== optionIndex);
      }
    }
    
    onUpdateCorrectAnswers(index, newCorrectAnswers);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <button
                {...attributes}
                {...listeners}
                className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {getQuestionTypeIcon(question.type)}
                <h4 className="font-medium">Question {index + 1}</h4>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <Badge variant="outline">
                  {question.points} pt{question.points > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Question Text */}
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              value={question.question}
              onChange={(e) => onUpdate(index, 'question', e.target.value)}
              placeholder="Tapez votre question ici..."
              rows={3}
            />
          </div>

          {/* Question Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type de Question</Label>
              <Select
                value={question.type}
                onValueChange={(value) => onUpdate(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Choix Unique</SelectItem>
                  <SelectItem value="multiple-select">Choix Multiple</SelectItem>
                  <SelectItem value="true-false">Vrai/Faux</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select
                value={question.difficulty}
                onValueChange={(value) => onUpdate(index, 'difficulty', value)}
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
            <div className="space-y-2">
              <Label>Points</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={question.points}
                onChange={(e) => onUpdate(index, 'points', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Options */}
          {question.type !== 'text-input' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options de Réponse</Label>
                {question.type === 'multiple-select' && (
                  <div className="text-xs text-gray-500">
                    {question.correctAnswers.length} réponse{question.correctAnswers.length > 1 ? 's' : ''} correcte{question.correctAnswers.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              {question.type === 'true-false' ? (
                <div className="space-y-2">
                  {['Vrai', 'Faux'].map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={question.correctAnswers.includes(optionIndex)}
                          onChange={(e) => handleCorrectAnswerChange(optionIndex, e.target.checked)}
                          className="mr-2"
                        />
                        <Label className="text-sm text-green-600">Correcte</Label>
                      </div>
                      <Input
                        value={option}
                        disabled
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <div className="flex items-center">
                        {question.type === 'multiple-choice' ? (
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswers.includes(optionIndex)}
                            onChange={(e) => handleCorrectAnswerChange(optionIndex, e.target.checked)}
                            className="mr-2"
                          />
                        ) : (
                          <Checkbox
                            checked={question.correctAnswers.includes(optionIndex)}
                            onCheckedChange={(checked) => handleCorrectAnswerChange(optionIndex, !!checked)}
                            className="mr-2"
                          />
                        )}
                        <Label className="text-sm text-green-600">
                          {question.type === 'multiple-choice' ? 'Correcte' : 'Correcte'}
                        </Label>
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => onUpdateOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  
                  {/* Add/Remove option buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(question.options || []), ''];
                        onUpdate(index, 'options', newOptions);
                      }}
                      disabled={(question.options?.length || 0) >= 6}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter une Option
                    </Button>
                    {(question.options?.length || 0) > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = question.options?.slice(0, -1) || [];
                          onUpdate(index, 'options', newOptions);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Multiple Select Configuration */}
          {question.type === 'multiple-select' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="space-y-2">
                <Label>Sélections Minimum</Label>
                <Input
                  type="number"
                  min="1"
                  max={question.options?.length || 2}
                  value={question.minSelections || 1}
                  onChange={(e) => onUpdate(index, 'minSelections', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Sélections Maximum</Label>
                <Input
                  type="number"
                  min={question.minSelections || 1}
                  max={question.options?.length || 2}
                  value={question.maxSelections || question.options?.length || 2}
                  onChange={(e) => onUpdate(index, 'maxSelections', parseInt(e.target.value) || 2)}
                />
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <Label>Explication de la Réponse</Label>
            <Textarea
              value={question.explanation}
              onChange={(e) => onUpdate(index, 'explanation', e.target.value)}
              placeholder="Expliquez pourquoi cette réponse est correcte..."
              rows={2}
            />
          </div>

          {/* Image Support */}
          <div className="flex items-center gap-2">
            <Switch
              checked={question.hasImage || false}
              onCheckedChange={(checked) => onUpdate(index, 'hasImage', checked)}
            />
            <Label>Inclure une image dans cette question</Label>
          </div>

          {question.hasImage && (
            <div className="space-y-2">
              <Label>URL de l'Image</Label>
              <Input
                value={question.imageUrl || ''}
                onChange={(e) => onUpdate(index, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface AdvancedQuizBuilderProps {
  moduleId: string;
  onSave: (quiz: AdvancedQuiz) => void;
  onCancel: () => void;
  existingQuiz?: AdvancedQuiz;
}

const AdvancedQuizBuilder = ({ moduleId, onSave, onCancel, existingQuiz }: AdvancedQuizBuilderProps) => {
  const [quiz, setQuiz] = useState<Partial<AdvancedQuiz>>({
    moduleId,
    title: existingQuiz?.title || "",
    description: existingQuiz?.description || "",
    passingGrade: existingQuiz?.passingGrade || 70,
    timeLimit: existingQuiz?.timeLimit || 30,
    maxAttempts: existingQuiz?.maxAttempts || 3,
    showFeedback: existingQuiz?.showFeedback || 'after-completion',
    randomizeQuestions: existingQuiz?.randomizeQuestions || false,
    questions: existingQuiz?.questions || [],
    isActive: existingQuiz?.isActive ?? true
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = (type: QuizQuestionAdvanced['type'] = 'multiple-choice') => {
    const newQuestion: QuizQuestionAdvanced = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      question: "",
      options: type === 'true-false' ? ['Vrai', 'Faux'] : ["", "", "", ""],
      correctAnswers: [],
      explanation: "",
      difficulty: "medium",
      points: 1,
      hasImage: false
    };

    if (type === 'multiple-select') {
      newQuestion.minSelections = 1;
      newQuestion.maxSelections = 2;
    }

    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestionAdvanced, value: any) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...(quiz.questions || [])];
    const updatedOptions = [...(updatedQuestions[questionIndex].options || [])];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = updatedOptions;
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const updateCorrectAnswers = (questionIndex: number, answers: number[]) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions[questionIndex].correctAnswers = answers;
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions.splice(index, 1);
    setQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const questions = quiz.questions || [];
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      
      const newQuestions = arrayMove(questions, oldIndex, newIndex);
      setQuiz(prev => ({ ...prev, questions: newQuestions }));
    }
  };

  const handleSave = () => {
    if (!quiz.title || !quiz.questions?.length) return;

    const completeQuiz: AdvancedQuiz = {
      id: existingQuiz?.id || `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      moduleId: quiz.moduleId!,
      title: quiz.title,
      description: quiz.description || "",
      questions: quiz.questions,
      passingGrade: quiz.passingGrade || 70,
      timeLimit: quiz.timeLimit,
      maxAttempts: quiz.maxAttempts || 3,
      showFeedback: quiz.showFeedback || 'after-completion',
      randomizeQuestions: quiz.randomizeQuestions || false,
      isActive: quiz.isActive ?? true,
      createdBy: "current_user",
      createdAt: existingQuiz?.createdAt || new Date().toISOString()
    };

    onSave(completeQuiz);
  };

  const getTotalPoints = () => {
    return quiz.questions?.reduce((total, q) => total + q.points, 0) || 0;
  };

  const getQuestionsValidation = () => {
    const invalidQuestions = quiz.questions?.filter(q => 
      !q.question.trim() || 
      q.correctAnswers.length === 0 || 
      (q.options && q.options.some(opt => !opt.trim()))
    ) || [];
    
    return {
      isValid: invalidQuestions.length === 0,
      invalidCount: invalidQuestions.length
    };
  };

  const validation = getQuestionsValidation();

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration du Quiz Avancé</CardTitle>
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
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="max-attempts">Tentatives Maximum</Label>
              <Input
                id="max-attempts"
                type="number"
                min="1"
                max="10"
                value={quiz.maxAttempts}
                onChange={(e) => setQuiz(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Feedback</Label>
              <Select
                value={quiz.showFeedback}
                onValueChange={(value) => setQuiz(prev => ({ ...prev, showFeedback: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiat</SelectItem>
                  <SelectItem value="after-completion">Après Completion</SelectItem>
                  <SelectItem value="never">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={quiz.randomizeQuestions || false}
                onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, randomizeQuestions: checked }))}
              />
              <Label>Mélanger les Questions</Label>
            </div>
            
            <div className="ml-auto text-sm text-gray-600">
              Total: {getTotalPoints()} points • {quiz.questions?.length || 0} questions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions du Quiz</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => addQuestion('multiple-choice')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Choix Unique
            </Button>
            <Button 
              variant="outline"
              onClick={() => addQuestion('multiple-select')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Choix Multiple
            </Button>
            <Button 
              variant="outline"
              onClick={() => addQuestion('true-false')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Vrai/Faux
            </Button>
          </div>
        </div>

        {!validation.isValid && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">
              {validation.invalidCount} question{validation.invalidCount > 1 ? 's' : ''} incomplète{validation.invalidCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={(quiz.questions || []).map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {quiz.questions?.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onUpdateOption={updateQuestionOption}
                onUpdateCorrectAnswers={updateCorrectAnswers}
                onRemove={removeQuestion}
              />
            ))}
          </SortableContext>
        </DndContext>

        {(quiz.questions?.length || 0) === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Aucune question ajoutée</h4>
              <p className="text-sm text-gray-500 mb-4">
                Commencez par ajouter des questions à votre quiz
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!quiz.title || !quiz.questions?.length || !validation.isValid}
          className="moov-gradient text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {existingQuiz ? 'Mettre à Jour' : 'Créer'} le Quiz
        </Button>
      </div>
    </div>
  );
};

export default AdvancedQuizBuilder;