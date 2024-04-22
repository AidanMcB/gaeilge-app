import type { QuizData } from '@/ts/interfaces';
import allQuizQuestions from '../assets/quizQuestions.json';
import { clearCachedQuiz, getLocalQuizData } from '@/utils/helper';
import { MultipleChoiceDataKeys } from '@/ts/enums';

// process.env === 'develop'

// Getters
export function _getAllQuizData(): Promise<QuizData[]> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(allQuizQuestions as QuizData[]);
        }, 500);
    });
}

export function _getNewQuizById(id: number): Promise<QuizData | undefined> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            const quiz = allQuizQuestions.find((quiz: QuizData) => quiz.section === id);
            if (quiz) {
                const cacheClearedQuiz = clearCachedQuiz(quiz);
                resolve(cacheClearedQuiz);
            }
        }, 300);
    });
}

export function _getActiveQuizData(): Promise<QuizData | undefined> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getLocalQuizData(MultipleChoiceDataKeys.StoredQuizData) as QuizData);
        }, 300);
    });
}

export function _getAvailableQuizSections(): Promise<number []> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(localStorage.getItem(MultipleChoiceDataKeys.AvailableSections) || '[1]'));
        }, 300);
    });
}

// Setters
export function _updateQuiz(quizData: QuizData): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MultipleChoiceDataKeys.StoredQuizData, JSON.stringify(quizData) ))
        }, 300);
    });
}

export function _setAvailableQuizSections(availableSections: number[]): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MultipleChoiceDataKeys.AvailableSections, JSON.stringify(availableSections)));
        }, 300);
    });
}
