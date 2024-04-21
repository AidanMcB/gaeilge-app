import type { QuizData, SubmittedData } from '@/ts/interfaces';
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

export function _getQuizById(id: number): Promise<QuizData | undefined> {
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

export function _getSubmittedAnswers(): Promise<SubmittedData> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getLocalQuizData(MultipleChoiceDataKeys.AnsweredQuestions) as SubmittedData);
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
export function _setSubmittedQuizData(submittedQuizData: SubmittedData): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MultipleChoiceDataKeys.AnsweredQuestions, JSON.stringify(submittedQuizData) ))
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
