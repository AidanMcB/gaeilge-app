import { MatchingDataKeys, MultipleChoiceDataKeys } from '@/ts/enums';
import type { QuizData, QuizQuestion, SubmittedData } from '@/ts/interfaces';
import type { VocabSection } from '@/ts/matching.interfaces';

export function getLocalQuizData(itemKey: string) {
    const localStorageData = localStorage.getItem(itemKey);
    let submittedData: SubmittedData = {} as SubmittedData;
    if (localStorageData) {
        submittedData = JSON.parse(localStorageData);
    } 
    return submittedData;
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
    localStorage.removeItem(MultipleChoiceDataKeys.AnsweredQuestions);
    localStorage.removeItem(MultipleChoiceDataKeys.QuestionNumber);
    localStorage.removeItem(MatchingDataKeys.ErrorCount);
    localStorage.removeItem(MatchingDataKeys.AnsweredQuestions);
    localStorage.removeItem(MatchingDataKeys.GroupNumber);
    localStorage.removeItem(MatchingDataKeys.TermsToPractice);
}

export function randomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randomizeArr(arr: any[]): any[] {
    if (arr) {
        return  arr.sort(() => Math.random() - 0.5);
    } else {
        return [];
    }
}

export function randomNextQuestion(allQuestions: QuizQuestion[], submittedQuestions: QuizQuestion[]): number {
    const allQuestionIds: number[] = allQuestions.map(q => q.id);
    const answeredQuestionIds: number[] = submittedQuestions?.map(q => q.id) || [];
    const remainingQuestionIds = allQuestionIds.filter(id => !answeredQuestionIds.includes(id));
    return remainingQuestionIds[Math.floor(Math.random()*remainingQuestionIds.length)];
}

export function calcPercent(num: number, total: number): number {
    return ((num / total)*100);
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

export function clearCachedSubmittedData(data: SubmittedData): SubmittedData {
    return {
        ...data,
        questions: []
    };
}