
import { useState, useCallback } from 'react';
import { Quiz, QuizAttempt, QuizResult, QuizFeedback } from '@/types/quiz';

export const useQuizManager = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const startQuiz = useCallback((quiz: Quiz) => {
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      quizId: quiz.id,
      userId: 'current_user', // This would come from auth context
      answers: new Array(quiz.questions.length).fill(-1),
      score: 0,
      passed: false,
      completedAt: '',
      timeSpent: 0
    };

    setCurrentQuiz(quiz);
    setQuizAttempt(attempt);
    setIsQuizActive(true);
  }, []);

  const submitAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    if (!quizAttempt) return;

    const updatedAnswers = [...quizAttempt.answers];
    updatedAnswers[questionIndex] = answerIndex;
    
    setQuizAttempt({
      ...quizAttempt,
      answers: updatedAnswers
    });
  }, [quizAttempt]);

  const submitQuiz = useCallback((): QuizResult | null => {
    if (!currentQuiz || !quizAttempt) return null;

    let correctAnswers = 0;
    const feedback: QuizFeedback[] = [];

    currentQuiz.questions.forEach((question, index) => {
      const userAnswer = quizAttempt.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;

      feedback.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect
      });
    });

    const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    const passed = percentage >= currentQuiz.passingGrade;

    const finalAttempt: QuizAttempt = {
      ...quizAttempt,
      score: percentage,
      passed,
      completedAt: new Date().toISOString(),
      timeSpent: Date.now() - parseInt(quizAttempt.id.split('_')[1])
    };

    const result: QuizResult = {
      attempt: finalAttempt,
      quiz: currentQuiz,
      correctAnswers,
      totalQuestions: currentQuiz.questions.length,
      percentage,
      feedback
    };

    setIsQuizActive(false);
    setCurrentQuiz(null);
    setQuizAttempt(null);

    return result;
  }, [currentQuiz, quizAttempt]);

  const abandonQuiz = useCallback(() => {
    setIsQuizActive(false);
    setCurrentQuiz(null);
    setQuizAttempt(null);
  }, []);

  return {
    currentQuiz,
    quizAttempt,
    isQuizActive,
    startQuiz,
    submitAnswer,
    submitQuiz,
    abandonQuiz
  };
};
