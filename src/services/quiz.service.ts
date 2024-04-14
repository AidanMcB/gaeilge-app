import type { QuizData, SubmittedData } from '@/ts/interfaces';
import questionDataJSON from '../assets/quizQuestionsA.json';
import { getLocalQuizData } from '@/utils/helper';
import { MultipleChoiceDataKeys } from '@/ts/enums';

// process.env === 'develop'

// Getters
export function _getAllQuizData(): Promise<QuizData[]> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(questionDataJSON as QuizData[]);
        }, 500);
    });
}

export function _getQuizById(id: number): Promise<QuizData | undefined> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(questionDataJSON.find((quiz: QuizData) => quiz.section === id));
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

// Setters
export function _setSubmittedQuizData(submittedQuizData: SubmittedData): Promise<void> {
    // Faked as async to mimic future behavior when API is built
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(localStorage.setItem(MultipleChoiceDataKeys.AnsweredQuestions, JSON.stringify(submittedQuizData) ))
        }, 300);
    });
}
