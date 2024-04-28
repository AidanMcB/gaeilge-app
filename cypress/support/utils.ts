import { type QuizData } from '../../src/ts/interfaces';
import type { VocabSection } from '../../src/ts/matching.interfaces';
import quizDataJson from '../fixtures/fixtures_quizQuestions.json';
import matchingDataJson from '../fixtures/fixtures_translateTerms.json';

const quizData = quizDataJson as QuizData[];
const matchingData = matchingDataJson as VocabSection[];

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