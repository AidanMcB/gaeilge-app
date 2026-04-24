import type { QuizData } from '../../src/ts/Quiz';
import quizDataJson from '../fixtures/fixtures_quizQuestions.json';

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

/** Index of the correct choice for `data-testid="radio-option-${index}"`. */
export function getCorrectAnswerIndex(sectionId: number, questionId: number): number | undefined {
    const quiz = quizData.find((q) => q.id == sectionId);
    if (!quiz) return undefined;
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return undefined;
    const idx = question.choices.findIndex((c) => c === question.correctAnswer);
    return idx >= 0 ? idx : undefined;
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

/** Index of an incorrect choice for `data-testid="radio-option-${index}"`. */
export function getIncorrectAnswerIndex(sectionId: number, questionId: number): number | undefined {
    const quiz = quizData.find((q) => q.id == sectionId);
    if (!quiz) return undefined;
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return undefined;
    const idx = question.choices.findIndex((c) => c !== question.correctAnswer);
    return idx >= 0 ? idx : undefined;
}