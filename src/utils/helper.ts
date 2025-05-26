import type { ErrorResponse } from '@/services/ts/Api.service.types';
import { AnswerState, MatchingDataKeys, MultipleChoiceDataKeys } from '@/ts/Constants';
import type { Term, VocabSection } from '@/ts/Matching';
import type { QuizData, QuizQuestion } from '@/ts/Quiz';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

export function getLocalQuizData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedQuizData: QuizData = {} as QuizData;
    if (localStorageData) {
        storedQuizData = JSON.parse(localStorageData);
    }
    return storedQuizData;
}

export function getLocalVocabData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let storedData: VocabSection = {} as VocabSection;
    if (localStorageData) {
        storedData = JSON.parse(localStorageData);
    }
    return storedData;
}

export function clearAllStoredData(): void {
    localStorage.removeItem(MultipleChoiceDataKeys.StoredQuizData);
    localStorage.removeItem(MultipleChoiceDataKeys.AnsweredQuestions);
    localStorage.removeItem(MultipleChoiceDataKeys.QuestionNumber);
    localStorage.removeItem(MatchingDataKeys.ErrorCount);
    localStorage.removeItem(MatchingDataKeys.StoredMatchingData);
    localStorage.removeItem(MatchingDataKeys.TermsToPractice);
}

export function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randomizeArr(arr: any[]): any[] {
    if (arr) {
        return arr.sort(() => Math.random() - 0.5);
    } else {
        return [];
    }
}

export function calcPercent(num: number, total: number): number {
    return ((num / total) * 100);
}

export function clearCachedQuestion(question: QuizQuestion): QuizQuestion {
    return {
        ...question,
        state: 'unanswered',
        selectedAnswer: '',
        isSubmitted: false,
        isCorrect: undefined,
    }
}

export function clearCachedQuiz(quiz: QuizData): QuizData {
    return {
        ...quiz,
        questions: quiz?.questions?.map(q => clearCachedQuestion(q)) || []
    };
}


export function clearCachedMatchingData(vocabSection: VocabSection): VocabSection {
    return {
        ...vocabSection,
        englishTerms: vocabSection?.englishTerms.map(term => clearAnsweredTerm(term)),
        irishTerms: vocabSection?.irishTerms.map(term => clearAnsweredTerm(term))
    };
}

export function clearAnsweredTerm(term: Term): Term {
    return {
        ...term,
        isSelected: false,
        state: AnswerState.Unanswered
    };
}

export const divideWithRemainder = (x: number, y: number): number[] => {
    return [Math.floor(x / y), x % y];
}

export const handleApiError = (error: AxiosError): ErrorResponse => {
    const parsedError: ErrorResponse = {
        status: "error",
        code: error.response?.status || 500,
        message: error.message,
        info: error.response?.data || null,
    };
    throw parsedError;
}

export const handleFirebaseError = (error: FirebaseError): ErrorResponse => {
    const parsedError: ErrorResponse = {
        status: "error",
        code: 500,
        message: error.code,
        info: error.message || null,
    };
    throw parsedError;
}

export const handleExternalApiError = (error: AxiosError | FirebaseError | unknown): ErrorResponse => {
    if (error instanceof FirebaseError) {
        return handleFirebaseError(error)
    } else if (error instanceof AxiosError) {
        return handleApiError(error)
    } else {
        return error as ErrorResponse
    }
}