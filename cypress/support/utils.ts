import { type QuizData, type QuizQuestion } from '../../src/ts/interfaces';
import quizDataJson from '../fixtures/quizQuestions.json';

const quizData = quizDataJson as QuizData[];

export function getCorrectAnswer(sectionId: number, questionId: number): string | undefined {
    const quiz = quizData.find(quiz => quiz.id == sectionId);
    if (quiz) {
        const question = quiz.questions.find(q => q.id === questionId);
        if (question) {
            return question.correctAnswer;
        }
    }
}

export function getIncorrectAnswer(sectionId: number, questionId: number): string | undefined {
    const quiz = quizData.find(quiz => quiz.id == sectionId);
    if (quiz) {
        const question = quiz.questions.find(q => q.id === questionId);
        if (question) {
            return question.choices.find(choice => choice !== question.correctAnswer);
        }
    }
}